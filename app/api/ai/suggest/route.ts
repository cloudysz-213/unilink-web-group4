import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function stripMarkdown(input: string) {
  return input.replace(/\`+/g, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text field required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `Based on this partial enquiry text from a university student: '${text}'\nWhat is the most likely category? Reply ONLY with JSON: { category: string, confidence: number }\nCategories: Academic, Visa & International, Graduation & Career, Welfare, Financial, Other`

    const result = await model.generateContent(prompt)
    const rawText = stripMarkdown(result.response.text())

    let category = 'Other'
    let confidence = 0.5

    try {
      const parsed = JSON.parse(rawText)
      if (parsed?.category && typeof parsed.category === 'string') {
        category = ['Academic', 'Visa & International', 'Graduation & Career', 'Welfare', 'Financial', 'Other'].includes(parsed.category)
          ? parsed.category
          : 'Other'
      }
      if (typeof parsed?.confidence === 'number') {
        confidence = Math.max(0, Math.min(1, parsed.confidence))
      }
    } catch (err) {
      console.error('Failed to parse suggestion JSON:', rawText)
    }

    return NextResponse.json({ category, confidence })
  } catch (error) {
    console.error('Suggest endpoint error:', error)
    return NextResponse.json({ category: 'Other', confidence: 0.5 }, { status: 500 })
  }
}
