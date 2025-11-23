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

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Build comprehensive prompt
    const totalSales = businessData.sales?.reduce((sum: number, sale: any) => sum + sale.amount, 0) || 0
    const totalExpenses = businessData.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
    const avgDaily = totalSales / (businessData.sales?.length || 1)

    const prompt = `Kamu adalah AI business analyst expert untuk UMKM/SMB di Indonesia.

Analisis data bisnis berikut dan berikan 6-8 insights dalam Bahasa Indonesia:

DATA PENJUALAN:
- Total Penjualan: Rp ${totalSales.toLocaleString('id-ID')}
- Jumlah Transaksi: ${businessData.sales?.length || 0}
- Rata-rata per Hari: Rp ${avgDaily.toLocaleString('id-ID')}

DATA INVENTORI:
- Total Produk: ${businessData.inventory?.length || 0}
- Produk Stok Rendah (<10): ${businessData.inventory?.filter((p: any) => p.stock < 10).length || 0}

DATA PENGELUARAN:
- Total Pengeluaran: Rp ${totalExpenses.toLocaleString('id-ID')}
- Net Profit: Rp ${(totalSales - totalExpenses).toLocaleString('id-ID')}

DATA PELANGGAN:
- Total Pelanggan: ${businessData.customers?.length || 0}
- Pelanggan Aktif: ${businessData.customers?.filter((c: any) => c.frequency > 5).length || 0}

INSTRUKSI:
Berikan insights dalam format berikut (WAJIB 6-8 insights):

1. [TREND] Judul Insight
Penjelasan detail tentang trend yang ditemukan dan rekomendasi aksi konkret.

2. [WARNING] Judul Peringatan
Penjelasan masalah yang perlu perhatian dan solusi yang disarankan.

3. [RECOMMENDATION] Judul Rekomendasi
Saran spesifik untuk meningkatkan bisnis dengan langkah-langkah jelas.

Fokus pada:
- Pola penjualan dan peluang pertumbuhan
- Optimasi inventori dan stok
- Efisiensi biaya operasional
- Strategi customer retention
- Prediksi tren mendatang
- Identifikasi risiko bisnis

Berikan insights yang actionable, spesifik, dan langsung bisa diterapkan!`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('=== GEMINI AI RESPONSE ===')
    console.log(text)
    console.log('=========================')

    // Parse insights from response
    const insights = parseInsightsFromText(text)

    console.log(`Parsed ${insights.length} insights`)

    return NextResponse.json({
      success: true,
      data: insights,
    })

  } catch (error: any) {
    console.error('Analytics insights error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

function parseInsightsFromText(text: string): any[] {
  const insights: any[] = []

  // Split by numbered items
  const sections = text.split(/\n(?=\d+\.\s*\[)/);

  for (const section of sections) {
    const trimmed = section.trim()
    if (trimmed.length < 30) continue

    // Extract type
    let type = 'recommendation'
    let impact = 'medium'

    if (trimmed.match(/\[TREND\]/i)) {
      type = 'trend'
      impact = 'medium'
    } else if (trimmed.match(/\[WARNING\]|PERINGATAN/i)) {
      type = 'warning'
      impact = 'high'
    } else if (trimmed.match(/\[RECOMMENDATION\]|REKOMENDASI/i)) {
      type = 'recommendation'
      impact = 'medium'
    } else if (trimmed.match(/\[ANOMALY\]|ANOMALI/i)) {
      type = 'anomaly'
      impact = 'high'
    }

    // Extract title and description
    const lines = trimmed.split('\n').filter(l => l.trim())
    if (lines.length === 0) continue

    // First line is title
    let title = lines[0]
      .replace(/^\d+\.\s*/, '')
      .replace(/\[(TREND|WARNING|RECOMMENDATION|ANOMALY|PERINGATAN|REKOMENDASI|ANOMALI)\]\s*/gi, '')
      .trim()

    // Rest is description
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

  // If parsing failed, try alternative format
  if (insights.length === 0) {
    const altSections = text.split(/\n\n+/)
    for (const section of altSections) {
      const lines = section.trim().split('\n')
      if (lines.length >= 2) {
        const title = lines[0].replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim()
        const description = lines.slice(1).join(' ').trim()

        if (title.length > 5 && description.length > 10) {
          insights.push({
            type: 'recommendation',
            title,
            description,
            impact: 'medium',
            actionable: true,
            confidence: 0.8
          })
        }
      }
    }
  }

  return insights
}
