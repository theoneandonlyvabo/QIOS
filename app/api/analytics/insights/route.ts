import { NextRequest, NextResponse } from 'next/server'
import { AIAnalytics, BusinessData } from '@/lib/ai/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessData } = body

    // Validate required fields
    if (!businessData) {
      return NextResponse.json(
        { success: false, error: 'Business data is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI analytics not configured' },
        { status: 500 }
      )
    }

    // Initialize AI Analytics
    const analytics = new AIAnalytics(process.env.OPENAI_API_KEY)

    // Generate insights
    const insights = await analytics.generateInsights(businessData as BusinessData)

    return NextResponse.json({
      success: true,
      data: insights,
    })

  } catch (error) {
    console.error('Analytics insights error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
