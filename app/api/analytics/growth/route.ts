import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { businessData } = body

        if (!businessData) {
            return NextResponse.json(
                { success: false, error: 'Business data is required' },
                { status: 400 }
            )
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'AI analytics not configured' },
                { status: 500 }
            )
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

        // Calculate growth metrics
        const salesData = businessData.sales || []
        const sortedSales = [...salesData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        const firstMonth = sortedSales.slice(0, 30)
        const lastMonth = sortedSales.slice(-30)

        const firstMonthTotal = firstMonth.reduce((sum, s) => sum + s.amount, 0)
        const lastMonthTotal = lastMonth.reduce((sum, s) => sum + s.amount, 0)
        const growthRate = ((lastMonthTotal - firstMonthTotal) / firstMonthTotal * 100).toFixed(2)

        const prompt = `Kamu adalah AI business analyst expert untuk UMKM/SMB di Indonesia.

Analisis PERTUMBUHAN BISNIS berdasarkan data berikut:

DATA PERTUMBUHAN:
- Penjualan Bulan Pertama: Rp ${firstMonthTotal.toLocaleString('id-ID')}
- Penjualan Bulan Terakhir: Rp ${lastMonthTotal.toLocaleString('id-ID')}
- Growth Rate: ${growthRate}%
- Total Transaksi: ${salesData.length}
- Jumlah Pelanggan: ${businessData.customers?.length || 0}

INSTRUKSI:
Berikan 5-6 insights tentang PERTUMBUHAN BISNIS dalam format:

1. [GROWTH] Judul Analisis Pertumbuhan
Penjelasan detail tentang tren pertumbuhan. Gunakan bullet points (-) jika merinci beberapa poin.

2. [OPPORTUNITY] Judul Peluang Pertumbuhan
Identifikasi peluang untuk akselerasi. Gunakan paragraf pendek (maksimal 2-3 kalimat).

Fokus pada:
- Analisis growth rate dan sustainability
- Identifikasi faktor pendorong pertumbuhan
- Peluang ekspansi dan scaling
- Strategi untuk akselerasi pertumbuhan
- Benchmark dengan industri sejenis
- Proyeksi pertumbuhan 3-6 bulan ke depan

PENTING: Gunakan bahasa yang profesional namun mudah dipahami. Hindari paragraf yang terlalu panjang.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const insights = parseGrowthInsights(text)

        return NextResponse.json({
            success: true,
            data: insights,
        })

    } catch (error: any) {
        console.error('Growth analysis error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

function parseGrowthInsights(text: string): any[] {
    const insights: any[] = []
    // Split by number followed by [TYPE], handling potential missing newlines
    const sections = text.replace(/(\d+\.\s*\[)/g, '\n$1').split(/\n(?=\d+\.\s*\[)/);

    for (const section of sections) {
        const trimmed = section.trim()
        if (trimmed.length < 30) continue

        let type = 'growth'
        let impact = 'high'

        if (trimmed.match(/\[GROWTH\]/i)) type = 'growth'
        else if (trimmed.match(/\[OPPORTUNITY\]/i)) type = 'opportunity'
        else if (trimmed.match(/\[CHALLENGE\]/i)) type = 'challenge', impact = 'medium'

        const lines = trimmed.split('\n').filter(l => l.trim())
        if (lines.length === 0) continue

        let title = lines[0]
            .replace(/^\d+\.\s*/, '')
            .replace(/\[(GROWTH|OPPORTUNITY|CHALLENGE)\]\s*/gi, '')
            .trim()

        const description = lines.slice(1).join(' ').trim()

        if (title.length > 5 && description.length > 10) {
            insights.push({
                type,
                title,
                description,
                impact,
                actionable: true,
                confidence: 0.85
            })
        }
    }

    return insights
}
