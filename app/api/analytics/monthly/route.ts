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

        const totalSales = businessData.sales?.reduce((sum: number, sale: any) => sum + sale.amount, 0) || 0
        const totalExpenses = businessData.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
        const netProfit = totalSales - totalExpenses

        const prompt = `Kamu adalah AI business analyst expert untuk UMKM/SMB di Indonesia.

Berikan EVALUASI BULANAN berdasarkan data berikut:

PERFORMA BULAN INI:
- Total Penjualan: Rp ${totalSales.toLocaleString('id-ID')}
- Total Pengeluaran: Rp ${totalExpenses.toLocaleString('id-ID')}
- Net Profit: Rp ${netProfit.toLocaleString('id-ID')}
- Profit Margin: ${((netProfit / totalSales) * 100).toFixed(2)}%
- Jumlah Transaksi: ${businessData.sales?.length || 0}
- Jumlah Pelanggan Aktif: ${businessData.customers?.filter((c: any) => c.frequency > 5).length || 0}

INSTRUKSI:
Berikan 5-6 insights EVALUASI BULANAN dalam format:

1. [EVALUATION] Judul Evaluasi Bulanan
Penjelasan detail tentang performa bulan ini. Gunakan bullet points (-) untuk rincian.

2. [ACTION] Judul Rekomendasi Aksi
Langkah konkret untuk bulan depan. Gunakan paragraf pendek (maksimal 2-3 kalimat).

Fokus pada:
- Perbandingan performa dengan bulan sebelumnya
- Pencapaian target penjualan
- Efisiensi operasional dan pengeluaran
- Kinerja produk best-seller vs slow-moving
- Retensi pelanggan bulan ini

PENTING: Gunakan bahasa yang profesional namun mudah dipahami. Hindari paragraf yang terlalu panjang.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const insights = parseMonthlyInsights(text)

        return NextResponse.json({
            success: true,
            data: insights,
        })

    } catch (error: any) {
        console.error('Monthly evaluation error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

function parseMonthlyInsights(text: string): any[] {
    const insights: any[] = []
    // Split by number followed by [TYPE], handling potential missing newlines
    const sections = text.replace(/(\d+\.\s*\[)/g, '\n$1').split(/\n(?=\d+\.\s*\[)/);

    for (const section of sections) {
        const trimmed = section.trim()
        if (trimmed.length < 30) continue

        let type = 'evaluation'
        let impact = 'medium'

        if (trimmed.match(/\[ACHIEVEMENT\]/i)) type = 'achievement', impact = 'high'
        else if (trimmed.match(/\[IMPROVEMENT\]/i)) type = 'improvement', impact = 'medium'
        else if (trimmed.match(/\[CHALLENGE\]/i)) type = 'challenge', impact = 'high'

        const lines = trimmed.split('\n').filter(l => l.trim())
        if (lines.length === 0) continue

        let title = lines[0]
            .replace(/^\d+\.\s*/, '')
            .replace(/\[(ACHIEVEMENT|IMPROVEMENT|CHALLENGE)\]\s*/gi, '')
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
