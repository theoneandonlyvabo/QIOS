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
        const lowStockProducts = businessData.inventory?.filter((p: any) => p.stock < 10).length || 0

        const prompt = `Kamu adalah AI risk management expert untuk UMKM/SMB di Indonesia.

Identifikasi RISIKO BISNIS dan berikan strategi MITIGASI berdasarkan data berikut:

DATA BISNIS:
- Total Penjualan: Rp ${totalSales.toLocaleString('id-ID')}
- Total Pengeluaran: Rp ${totalExpenses.toLocaleString('id-ID')}
- Produk Stok Rendah: ${lowStockProducts} produk
- Jumlah Pelanggan: ${businessData.customers?.length || 0}
- Dependency pada Top Customer: ${businessData.customers?.[0]?.frequency || 0} transaksi

INSTRUKSI:
Berikan 5-6 insights tentang RISIKO dan MITIGASI dalam format:

1. [RISK] Judul Identifikasi Risiko
Penjelasan detail tentang risiko yang terdeteksi. Gunakan bullet points (-) untuk rincian.

2. [MITIGATION] Judul Mitigasi Risiko
Langkah konkret untuk meminimalkan risiko. Gunakan paragraf pendek (maksimal 2-3 kalimat).

Fokus pada:
- Risiko stok (dead stock, stockout)
- Risiko arus kas dan profitabilitas
- Risiko kehilangan pelanggan (churn)
- Risiko operasional toko
- Kompetisi dan faktor eksternal

PENTING: Gunakan bahasa yang profesional namun mudah dipahami. Hindari paragraf yang terlalu panjang.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const insights = parseRiskInsights(text)

        return NextResponse.json({
            success: true,
            data: insights,
        })

    } catch (error: any) {
        console.error('Risk mitigation error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

function parseRiskInsights(text: string): any[] {
    const insights: any[] = []
    // Split by number followed by [TYPE], handling potential missing newlines
    const sections = text.replace(/(\d+\.\s*\[)/g, '\n$1').split(/\n(?=\d+\.\s*\[)/);

    for (const section of sections) {
        const trimmed = section.trim()
        if (trimmed.length < 30) continue

        let type = 'risk'
        let impact = 'high'

        if (trimmed.match(/\[RISK\]/i)) type = 'risk', impact = 'high'
        else if (trimmed.match(/\[MITIGATION\]/i)) type = 'mitigation', impact = 'medium'
        else if (trimmed.match(/\[CONTINGENCY\]/i)) type = 'contingency', impact = 'medium'

        const lines = trimmed.split('\n').filter(l => l.trim())
        if (lines.length === 0) continue

        let title = lines[0]
            .replace(/^\d+\.\s*/, '')
            .replace(/\[(RISK|MITIGATION|CONTINGENCY)\]\s*/gi, '')
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
