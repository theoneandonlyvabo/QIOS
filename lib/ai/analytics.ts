import OpenAI from 'openai'

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
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    })
  }

  async generateInsights(data: BusinessData): Promise<BusinessInsight[]> {
    try {
      const prompt = this.buildAnalyticsPrompt(data)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI business analyst specializing in UMKM/SMB retail operations. 
            Analyze the provided business data and generate actionable insights in Indonesian.
            Focus on identifying trends, anomalies, opportunities, and risks.
            Provide specific, actionable recommendations for business growth.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const insights = this.parseInsights(response.choices[0].message.content || '')
      return insights
    } catch (error) {
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
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor specializing in UMKM cashflow management. Provide practical, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      return {
        cashflow: {
          inflow: totalSales,
          outflow: totalExpenses,
          net: netCashflow,
          trend: netCashflow > 0 ? 'positive' : netCashflow < 0 ? 'negative' : 'stable'
        },
        recommendations: this.extractRecommendations(response.choices[0].message.content || ''),
        risks: this.extractRisks(response.choices[0].message.content || '')
      }
    } catch (error) {
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
        ${lowStockItems.map(item => `${item.name}: ${item.stock} units`).join('\n')}
        
        Provide inventory management recommendations and stock alerts.
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an inventory management expert for retail businesses. Provide practical stock management advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      return {
        stockAlerts: lowStockItems.map(item => ({
          productId: item.productId,
          name: item.name,
          currentStock: item.stock,
          recommendedStock: Math.max(item.stock * 2, 20),
          urgency: item.stock < 5 ? 'high' : item.stock < 10 ? 'medium' : 'low'
        })),
        recommendations: this.extractRecommendations(response.choices[0].message.content || '')
      }
    } catch (error) {
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
    const lines = content.split('\n').filter(line => line.trim())
    
    let currentInsight: Partial<BusinessInsight> = {}
    
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        if (currentInsight.title) {
          insights.push(currentInsight as BusinessInsight)
        }
        currentInsight = {
          title: line.replace(/^\d+\.\s*/, ''),
          type: 'recommendation',
          impact: 'medium',
          actionable: true,
          confidence: 0.8
        }
      } else if (line.includes('trend') || line.includes('tren')) {
        currentInsight.type = 'trend'
      } else if (line.includes('warning') || line.includes('peringatan')) {
        currentInsight.type = 'warning'
        currentInsight.impact = 'high'
      } else if (line.includes('anomaly') || line.includes('anomali')) {
        currentInsight.type = 'anomaly'
      }
      
      if (line.length > 20 && !currentInsight.description) {
        currentInsight.description = line
      }
    }
    
    if (currentInsight.title) {
      insights.push(currentInsight as BusinessInsight)
    }
    
    return insights
  }

  private extractRecommendations(content: string): string[] {
    const recommendations: string[] = []
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('saran') || line.includes('suggest')) {
        recommendations.push(line.trim())
      }
    }
    
    return recommendations
  }

  private extractRisks(content: string): string[] {
    const risks: string[] = []
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      if (line.includes('risk') || line.includes('risiko') || line.includes('warning') || line.includes('peringatan')) {
        risks.push(line.trim())
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
