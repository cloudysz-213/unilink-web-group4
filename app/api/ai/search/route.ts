import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query field required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const supabase = await createClient()
    const q = `%${query}%`

    const { data: searchResults, error: searchError } = await supabase
      .from('enquiries')
      .select('id, title, description')
      .or(`title.ilike.${q},description.ilike.${q}`)
      .limit(10)

    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json({ answer: 'Unable to search knowledge base at this time.', sources: [] }, { status: 500 })
    }

    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({ answer: 'No matching enquiries found in our knowledge base. Please submit a new enquiry or contact support.', sources: [] })
    }

    const sourceList = searchResults.map((r: any) => ({ id: r.id, title: r.title, description: r.description }))
    const context = sourceList.map((item: any, idx: number) => `${idx + 1}. Title: ${item.title}\nDescription: ${item.description}`).join('\n\n')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `Student is searching for: '${query}'\nHere are relevant past enquiries and documents:\n${context}\n\nWrite a helpful 2-3 sentence answer based on these sources.`

    const result = await model.generateContent(prompt)
    const answer = result.response.text().trim()

    return NextResponse.json({ answer, sources: sourceList })
  } catch (error) {
    console.error('Search endpoint error:', error)
    return NextResponse.json({ answer: 'Unable to process your search at this time. Please try again or contact support.', sources: [] }, { status: 500 })
  }
}
