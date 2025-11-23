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

        const salesData = businessData.sales || []
        const avgDaily = salesData.reduce((sum: number, s: any) => sum + s.amount, 0) / salesData.length

        const prompt = `Kamu adalah AI business analyst expert untuk UMKM/SMB di Indonesia.

Berikan PREDIKSI TREN berdasarkan data historis berikut:

DATA HISTORIS:
- Total Penjualan: Rp ${salesData.reduce((sum: number, s: any) => sum + s.amount, 0).toLocaleString('id-ID')}
- Rata-rata Harian: Rp ${avgDaily.toLocaleString('id-ID')}
- Periode Data: ${salesData.length} hari
- Jumlah Produk: ${businessData.inventory?.length || 0}
- Jumlah Pelanggan: ${businessData.customers?.length || 0}

INSTRUKSI:
Berikan 5-6 PREDIKSI TREN untuk 1-3 bulan ke depan dalam format:

1. [TREND] Judul Prediksi Tren
Penjelasan detail tentang tren yang akan datang. Gunakan bullet points (-) untuk rincian.

2. [STRATEGY] Judul Strategi Tren
Strategi untuk memanfaatkan tren tersebut. Gunakan paragraf pendek (maksimal 2-3 kalimat).

Fokus pada:
- Prediksi tren penjualan 30 hari ke depan
- Tren preferensi produk pelanggan
- Pola belanja musiman (seasonality)
- Antisipasi perubahan pasar
- Persiapan stok untuk tren mendatang

PENTING: Gunakan bahasa yang profesional namun mudah dipahami. Hindari paragraf yang terlalu panjang.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const insights = parseTrendInsights(text)

        return NextResponse.json({
            success: true,
            data: insights,
        })

    } catch (error: any) {
        console.error('Trend prediction error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

function parseTrendInsights(text: string): any[] {
    const insights: any[] = []
    // Split by number followed by [TYPE], handling potential missing newlines
    const sections = text.replace(/(\d+\.\s*\[)/g, '\n$1').split(/\n(?=\d+\.\s*\[)/);

    for (const section of sections) {
        const trimmed = section.trim()
        if (trimmed.length < 30) continue

        let type = 'forecast'
        let impact = 'medium'

        if (trimmed.match(/\[FORECAST\]/i)) type = 'forecast', impact = 'high'
        else if (trimmed.match(/\[SEASONAL\]/i)) type = 'seasonal', impact = 'medium'
        else if (trimmed.match(/\[TREND\]/i)) type = 'trend', impact = 'medium'

        const lines = trimmed.split('\n').filter(l => l.trim())
        if (lines.length === 0) continue

        let title = lines[0]
            .replace(/^\d+\.\s*/, '')
            .replace(/\[(FORECAST|SEASONAL|TREND)\]\s*/gi, '')
            .trim()

        const description = lines.slice(1).join(' ').trim()

        if (title.length > 5 && description.length > 10) {
            insights.push({
                type,
                title,
                description,
                impact,
                actionable: true,
                confidence: 0.80
            })
        }
    }

    return insights
}
