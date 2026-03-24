import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { period = '30' } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const days = parseInt(period as string, 10) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const supabase = await createClient()
    const { data: enquiries, error: queryError } = await supabase
      .from('enquiries')
      .select('id, category, status, created_at, resolved_at, updated_at')
      .gte('created_at', startDate.toISOString())

    if (queryError) {
      console.error('Query error:', queryError)
      return NextResponse.json({ summary: 'Unable to retrieve analytics data at this time.', metrics: {}, trends: [] }, { status: 500 })
    }

    const list = enquiries || []
    const totalEnquiries = list.length

    const categoryCount: Record<string, number> = {}
    const statusCount: Record<string, number> = {}

    let resolvedCount = 0
    let totalResolutionMs = 0

    list.forEach((e: any) => {
      const category = e.category || 'Other'
      categoryCount[category] = (categoryCount[category] || 0) + 1

      const status = e.status || 'unknown'
      statusCount[status] = (statusCount[status] || 0) + 1

      if (status === 'resolved' || status === 'closed') {
        const created = e.created_at ? new Date(e.created_at) : null
        const resolved = e.resolved_at ? new Date(e.resolved_at) : e.updated_at ? new Date(e.updated_at) : null
        if (created && resolved && resolved > created) {
          totalResolutionMs += resolved.getTime() - created.getTime()
          resolvedCount += 1
        }
      }
    })

    const avgResolutionHours = resolvedCount > 0 ? totalResolutionMs / resolvedCount / (1000 * 60 * 60) : 0

    const metrics = {
      period_days: days,
      total_enquiries: totalEnquiries,
      category_count: categoryCount,
      status_count: statusCount,
      average_resolution_time_hours: Number(avgResolutionHours.toFixed(2))
    }

    const prompt = `Student enquiry analytics summary request:\nTotal enquiries (last ${days} days): ${totalEnquiries}\nCategory counts: ${JSON.stringify(categoryCount)}\nStatus counts: ${JSON.stringify(statusCount)}\nAverage resolution time (hours): ${avgResolutionHours.toFixed(2)}\n\nPlease write a 3-sentence executive summary and list 3 key trends.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const summary = result.response.text().trim()

    const trends: string[] = []
    const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])
    if (sortedCategories.length > 0) {
      trends.push(`Top category: ${sortedCategories[0][0]} (${sortedCategories[0][1]} enquiries)`)
    }

    const sortedStatuses = Object.entries(statusCount).sort((a, b) => b[1] - a[1])
    if (sortedStatuses.length > 0) {
      trends.push(`Top status: ${sortedStatuses[0][0]} (${sortedStatuses[0][1]})`)
    }

    if (avgResolutionHours < 24) {
      trends.push('Fast resolution time under 24 hours on average')
    } else if (avgResolutionHours < 72) {
      trends.push('Moderate resolution time, within 3 days on average')
    } else {
      trends.push('Needs improvement: average resolution time over 3 days')
    }

    return NextResponse.json({ summary, metrics, trends })
  } catch (error) {
    console.error('Analytics endpoint error:', error)
    return NextResponse.json({ summary: 'Unable to generate analytics at this time.', metrics: {}, trends: [] }, { status: 500 })
  }
}
