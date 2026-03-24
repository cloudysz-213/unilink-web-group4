import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function stripMarkdown(input: string) {
  return input.replace(/\`+/g, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const prompt = `Classify this university student enquiry:\nTitle: ${title}\nDescription: ${description}\n\nReturn ONLY a JSON object with these exact fields:\n{\n  complexity: 'general' or 'complex',\n  category: one of 'Academic' | 'Visa & International' | 'Graduation & Career' | 'Welfare' | 'Financial' | 'Other',\n  priority: 'low' or 'medium' or 'high',\n  suggested_response: short reply if general, empty string if complex\n}\nNo markdown, no explanation, just the JSON.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const rawText = stripMarkdown(result.response.text())

    let classification = {
      complexity: 'general',
      category: 'Other',
      priority: 'medium',
      suggested_response: ''
    }

    try {
      const parsed = JSON.parse(rawText)
      classification = {
        complexity: parsed.complexity === 'complex' ? 'complex' : 'general',
        category: ['Academic', 'Visa & International', 'Graduation & Career', 'Welfare', 'Financial', 'Other'].includes(parsed.category) ? parsed.category : 'Other',
        priority: ['low', 'medium', 'high'].includes(parsed.priority) ? parsed.priority : 'medium',
        suggested_response: typeof parsed.suggested_response === 'string' ? parsed.suggested_response : ''
      }
    } catch (err) {
      console.error('Failed to parse classification JSON:', rawText)
    }

    return NextResponse.json(classification)
  } catch (error) {
    console.error('Classify endpoint error:', error)
    return NextResponse.json({ complexity: 'general', category: 'Other', priority: 'medium', suggested_response: '' }, { status: 500 })
  }
}
