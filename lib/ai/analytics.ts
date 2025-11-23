import { GoogleGenerativeAI } from '@google/generative-ai'

export interface BusinessData {
  sales: Array<{
    date: string
    amount: number
    items: number
    customerCount: number
  }>
  inventory: Array<{
    productId: string
    name: string
    stock: number
    price: number
    category: string
  }>
  expenses: Array<{
    date: string
    amount: number
    category: string
    description: string
  }>
  customers: Array<{
    id: string
    name: string
    email: string
    totalSpent: number
    lastPurchase: string
    frequency: number
  }>
}

export interface BusinessInsight {
  type: 'trend' | 'anomaly' | 'recommendation' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  action?: string
  confidence: number
}

export class AIAnalytics {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }

  async generateInsights(data: BusinessData): Promise<BusinessInsight[]> {
    try {
      const prompt = this.buildAnalyticsPrompt(data)

      const systemInstruction = `You are an expert AI business analyst specializing in UMKM/SMB retail operations in Indonesia. 
      Analyze the provided business data and generate comprehensive, actionable insights in Bahasa Indonesia.
      
      IMPORTANT: Generate AT LEAST 6-8 insights covering different aspects:
      - Sales trends and patterns
      - Customer behavior analysis
      - Inventory optimization opportunities
      - Revenue growth strategies
      - Cost management recommendations
      - Risk identification and mitigation
      
      Format EVERY insight as follows:
      [TYPE] Title
      Detailed description explaining the insight. Use bullet points (-) for details.
      
      Types: TREND, WARNING, RECOMMENDATION, ANOMALY
      
      Example:
      1. [TREND] Peningkatan Penjualan Weekend Signifikan
      Data menunjukkan penjualan meningkat 35% pada akhir pekan.
      - Sabtu: Peningkatan 20%
      - Minggu: Peningkatan 15%
      Rekomendasi: Tingkatkan stok produk populer di weekend.
      
      2. [WARNING] Stok Kritis Pada Produk Best-Seller
      3 produk dengan penjualan tertinggi memiliki stok di bawah 10 unit.
      - Kopi Susu: 5 unit
      - Roti Bakar: 8 unit
      Rekomendasi: Segera restock produk tersebut.
      
      Generate insights that are specific, data-driven, and immediately actionable.`

      const result = await this.model.generateContent([systemInstruction, prompt])
      const response = await result.response
      const text = response.text()

      console.log('Gemini AI Response:', text) // Debug log

      const insights = this.parseInsights(text)
      return insights
    } catch (error: any) {
      console.error('AI Analytics error:', error)
      return []
    }
  }

  async generateCashflowAnalysis(data: BusinessData): Promise<{
    cashflow: {
      inflow: number
      outflow: number
      net: number
      trend: 'positive' | 'negative' | 'stable'
    }
    recommendations: string[]
    risks: string[]
  }> {
    try {
      const totalSales = data.sales.reduce((sum, sale) => sum + sale.amount, 0)
      const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const netCashflow = totalSales - totalExpenses

      const prompt = `
        Analyze the following cashflow data for a UMKM retail business:
        
        Total Sales: Rp. ${totalSales.toLocaleString()}
        Total Expenses: Rp. ${totalExpenses.toLocaleString()}
        Net Cashflow: Rp. ${netCashflow.toLocaleString()}
        
        Sales Trend: ${this.calculateTrend(data.sales.map(s => s.amount))}
        Expense Trend: ${this.calculateTrend(data.expenses.map(e => e.amount))}
        
        Provide specific recommendations for cashflow optimization and identify potential risks.
        Focus on actionable strategies for UMKM businesses.
        
        Format your response in two sections:
        RECOMMENDATIONS:
        - List specific recommendations
        
        RISKS:
        - List potential risks
      `

      const systemInstruction = 'You are a financial advisor specializing in UMKM cashflow management. Provide practical, actionable advice in Indonesian.'

      const result = await this.model.generateContent([systemInstruction, prompt])
      const response = await result.response
      const text = response.text()

      return {
        cashflow: {
          inflow: totalSales,
          outflow: totalExpenses,
          net: netCashflow,
          trend: netCashflow > 0 ? 'positive' : netCashflow < 0 ? 'negative' : 'stable'
        },
        recommendations: this.extractRecommendations(text),
        risks: this.extractRisks(text)
      }
    } catch (error: any) {
      console.error('Cashflow analysis error:', error)
      return {
        cashflow: {
          inflow: 0,
          outflow: 0,
          net: 0,
          trend: 'stable'
        },
        recommendations: [],
        risks: []
      }
    }
  }

  async generateInventoryInsights(data: BusinessData): Promise<{
    stockAlerts: Array<{
      productId: string
      name: string
      currentStock: number
      recommendedStock: number
      urgency: 'high' | 'medium' | 'low'
    }>
    recommendations: string[]
  }> {
    try {
      const lowStockItems = data.inventory.filter(item => item.stock < 10)
      const highValueItems = data.inventory.filter(item => item.price > 100000)

      const prompt = `
        Analyze the following inventory data:
        
        Total Products: ${data.inventory.length}
        Low Stock Items: ${lowStockItems.length}
        High Value Items: ${highValueItems.length}
        
        Products with low stock:
        ${lowStockItems.map(item => `${item.name}: ${item.stock} units (Rp. ${item.price.toLocaleString()})`).join('\n')}
        
        Provide inventory management recommendations and stock alerts.
        Focus on practical advice for UMKM retail businesses.
        
        Format your response as:
        RECOMMENDATIONS:
        - List specific inventory management recommendations
      `

      const systemInstruction = 'You are an inventory management expert for retail businesses. Provide practical stock management advice in Indonesian.'

      const result = await this.model.generateContent([systemInstruction, prompt])
      const response = await result.response
      const text = response.text()

      return {
        stockAlerts: lowStockItems.map(item => ({
          productId: item.productId,
          name: item.name,
          currentStock: item.stock,
          recommendedStock: Math.max(item.stock * 2, 20),
          urgency: item.stock < 5 ? 'high' : item.stock < 10 ? 'medium' : 'low'
        })),
        recommendations: this.extractRecommendations(text)
      }
    } catch (error: any) {
      console.error('Inventory analysis error:', error)
      return {
        stockAlerts: [],
        recommendations: []
      }
    }
  }

  private buildAnalyticsPrompt(data: BusinessData): string {
    const totalSales = data.sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const avgOrderValue = totalSales / data.sales.length
    const customerCount = data.customers.length

    return `
      Analyze the following business data for a UMKM retail business:
      
      SALES DATA:
      - Total Sales: Rp. ${totalSales.toLocaleString()}
      - Number of Transactions: ${data.sales.length}
      - Average Order Value: Rp. ${avgOrderValue.toLocaleString()}
      - Total Customers: ${customerCount}
      
      INVENTORY DATA:
      - Total Products: ${data.inventory.length}
      - Low Stock Items: ${data.inventory.filter(item => item.stock < 10).length}
      - High Value Items: ${data.inventory.filter(item => item.price > 100000).length}
      
      EXPENSE DATA:
      - Total Expenses: Rp. ${totalExpenses.toLocaleString()}
      - Expense Categories: ${[...new Set(data.expenses.map(e => e.category))].join(', ')}
      
      CUSTOMER DATA:
      - Total Customers: ${customerCount}
      - High Value Customers: ${data.customers.filter(c => c.totalSpent > avgOrderValue * 5).length}
      
      Provide insights on:
      1. Sales trends and opportunities
      2. Inventory optimization
      3. Customer behavior patterns
      4. Cost management
      5. Growth recommendations
      
      Format as actionable insights with specific recommendations.
    `
  }

  private parseInsights(content: string): BusinessInsight[] {
    const insights: BusinessInsight[] = []

    // Pre-process content to ensure newlines before numbered items
    // This handles cases where AI returns "1. [TYPE] ... 2. [TYPE] ..." on the same line
    const formattedContent = content
      .replace(/(\d+\.\s*\[)/g, '\n$1')
      .replace(/(\d+\.\s*\[)/g, '\n$1') // Repeat to ensure separation

    const lines = formattedContent.split('\n').filter(line => line.trim())

    let currentInsight: Partial<BusinessInsight> = {}

    for (const line of lines) {
      // Check for numbered items or bullet points
      if (line.match(/^(\d+\.|[-*])\s/)) {
        if (currentInsight.title) {
          insights.push(this.completeInsight(currentInsight))
        }

        // Extract title and determine type
        let title = line.replace(/^(\d+\.|[-*])\s*/, '').trim()
        let type: BusinessInsight['type'] = 'recommendation'

        if (title.includes('[TREND]') || title.includes('TREND')) {
          type = 'trend'
          title = title.replace(/\[TREND\]/gi, '').trim()
        } else if (title.includes('[WARNING]') || title.includes('WARNING') || title.includes('PERINGATAN')) {
          type = 'warning'
          title = title.replace(/\[WARNING\]/gi, '').trim()
        } else if (title.includes('[ANOMALY]') || title.includes('ANOMALI')) {
          type = 'anomaly'
          title = title.replace(/\[ANOMALY\]/gi, '').trim()
        } else if (title.includes('[RECOMMENDATION]') || title.includes('REKOMENDASI')) {
          type = 'recommendation'
          title = title.replace(/\[RECOMMENDATION\]/gi, '').trim()
        }

        currentInsight = {
          title: title,
          type: type,
          impact: type === 'warning' ? 'high' : 'medium',
          actionable: true,
          confidence: 0.8,
          description: ''
        }
      } else if (currentInsight.title && line.length > 20) {
        // Add to description
        currentInsight.description = currentInsight.description
          ? currentInsight.description + ' ' + line.trim()
          : line.trim()
      }
    }

    if (currentInsight.title) {
      insights.push(this.completeInsight(currentInsight))
    }

    return insights.filter(insight => insight.title && insight.description)
  }

  private completeInsight(partial: Partial<BusinessInsight>): BusinessInsight {
    return {
      type: partial.type || 'recommendation',
      title: partial.title || 'Insight',
      description: partial.description || '',
      impact: partial.impact || 'medium',
      actionable: partial.actionable !== undefined ? partial.actionable : true,
      action: partial.action,
      confidence: partial.confidence || 0.8
    }
  }

  private extractRecommendations(content: string): string[] {
    const recommendations: string[] = []
    const lines = content.split('\n').filter(line => line.trim())

    let inRecommendationSection = false

    for (const line of lines) {
      if (line.toUpperCase().includes('RECOMMENDATION') || line.toUpperCase().includes('REKOMENDASI')) {
        inRecommendationSection = true
        continue
      }

      if (line.toUpperCase().includes('RISK') || line.toUpperCase().includes('RISIKO')) {
        inRecommendationSection = false
        continue
      }

      if (inRecommendationSection && (line.match(/^[-*]\s/) || line.match(/^\d+\./))) {
        const rec = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s*/, '').trim()
        if (rec.length > 10) {
          recommendations.push(rec)
        }
      }
    }

    return recommendations
  }

  private extractRisks(content: string): string[] {
    const risks: string[] = []
    const lines = content.split('\n').filter(line => line.trim())

    let inRiskSection = false

    for (const line of lines) {
      if (line.toUpperCase().includes('RISK') || line.toUpperCase().includes('RISIKO')) {
        inRiskSection = true
        continue
      }

      if (line.toUpperCase().includes('RECOMMENDATION') || line.toUpperCase().includes('REKOMENDASI')) {
        inRiskSection = false
        continue
      }

      if (inRiskSection && (line.match(/^[-*]\s/) || line.match(/^\d+\./))) {
        const risk = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s*/, '').trim()
        if (risk.length > 10) {
          risks.push(risk)
        }
      }
    }

    return risks
  }

  private calculateTrend(values: number[]): string {
    if (values.length < 2) return 'insufficient data'

    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length

    const change = ((secondAvg - firstAvg) / firstAvg) * 100

    if (change > 10) return 'increasing'
    if (change < -10) return 'decreasing'
    return 'stable'
  }
}
