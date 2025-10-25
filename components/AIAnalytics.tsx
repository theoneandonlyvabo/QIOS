'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Package, DollarSign } from 'lucide-react'

interface BusinessInsight {
  type: 'trend' | 'anomaly' | 'recommendation' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  action?: string
  confidence: number
}

interface CashflowAnalysis {
  cashflow: {
    inflow: number
    outflow: number
    net: number
    trend: 'positive' | 'negative' | 'stable'
  }
  recommendations: string[]
  risks: string[]
}

interface InventoryInsights {
  stockAlerts: Array<{
    productId: string
    name: string
    currentStock: number
    recommendedStock: number
    urgency: 'high' | 'medium' | 'low'
  }>
  recommendations: string[]
}

const AIAnalytics = () => {
  const [insights, setInsights] = useState<BusinessInsight[]>([])
  const [cashflowAnalysis, setCashflowAnalysis] = useState<CashflowAnalysis | null>(null)
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'business' | 
    'cashflow' | 
    'inventory' | 
    'growth' | 
    'monthly' | 
    'trends' | 
    'risks'
  >('business')

  // Mock business data - in real app, this would come from your database
  const mockBusinessData = {
    sales: [
      { date: '2024-01-01', amount: 1500000, items: 25, customerCount: 20 },
      { date: '2024-01-02', amount: 1200000, items: 20, customerCount: 15 },
      { date: '2024-01-03', amount: 1800000, items: 30, customerCount: 25 },
    ],
    inventory: [
      { productId: '1', name: 'Product A', stock: 5, price: 50000, category: 'Electronics' },
      { productId: '2', name: 'Product B', stock: 15, price: 75000, category: 'Clothing' },
      { productId: '3', name: 'Product C', stock: 2, price: 100000, category: 'Electronics' },
    ],
    expenses: [
      { date: '2024-01-01', amount: 500000, category: 'Rent', description: 'Monthly rent' },
      { date: '2024-01-02', amount: 200000, category: 'Utilities', description: 'Electricity bill' },
    ],
    customers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', totalSpent: 500000, lastPurchase: '2024-01-01', frequency: 5 },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', totalSpent: 750000, lastPurchase: '2024-01-02', frequency: 8 },
    ]
  }

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData: mockBusinessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateCashflowAnalysis = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/cashflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData: mockBusinessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setCashflowAnalysis(result.data)
      }
    } catch (error) {
      console.error('Error generating cashflow analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateInventoryInsights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData: mockBusinessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setInventoryInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating inventory insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
      case 'anomaly':
        return <Brain className="w-5 h-5 text-purple-600" />
      default:
        return <Brain className="w-5 h-5 text-gray-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analitik AI</h2>
            <p className="text-gray-600 dark:text-gray-400">Wawasan dan rekomendasi bisnis berbasis AI</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'business') generateInsights()
            else if (activeTab === 'cashflow') generateCashflowAnalysis()
            else if (activeTab === 'inventory') generateInventoryInsights()
          }}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Menganalisis...' : 'Hasilkan Analisis'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'business'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Wawasan Bisnis
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'cashflow'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Analisis Arus Kas
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'inventory'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Wawasan Inventori
        </button>
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'growth'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Analisis Pertumbuhan
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'monthly'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Evaluasi Bulanan
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'trends'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Prediksi Tren
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'risks'
              ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Mitigasi Risiko
        </button>
      </div>

      {/* Content */}
      {activeTab === 'business' && (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Klik "Hasilkan Analisis" untuk mendapatkan wawasan bisnis berbasis AI</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getImpactColor(insight.impact)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Impact: {insight.impact} • Confidence: {Math.round(insight.confidence * 100)}%
                        </span>
                        {insight.actionable && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="space-y-4">
          {!cashflowAnalysis ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Click "Generate Analysis" to get cashflow insights</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cashflow Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Cash Inflow</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    Rp. {cashflowAnalysis.cashflow.inflow.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                    <span className="text-sm font-medium text-red-800">Cash Outflow</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900">
                    Rp. {cashflowAnalysis.cashflow.outflow.toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 border rounded-lg ${
                  cashflowAnalysis.cashflow.trend === 'positive' 
                    ? 'bg-green-50 border-green-200' 
                    : cashflowAnalysis.cashflow.trend === 'negative'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className={`w-5 h-5 ${
                      cashflowAnalysis.cashflow.trend === 'positive' 
                        ? 'text-green-600' 
                        : cashflowAnalysis.cashflow.trend === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      cashflowAnalysis.cashflow.trend === 'positive' 
                        ? 'text-green-800' 
                        : cashflowAnalysis.cashflow.trend === 'negative'
                        ? 'text-red-800'
                        : 'text-gray-800'
                    }`}>Net Cashflow</span>
                  </div>
                  <p className={`text-2xl font-bold ${
                    cashflowAnalysis.cashflow.trend === 'positive' 
                      ? 'text-green-900' 
                      : cashflowAnalysis.cashflow.trend === 'negative'
                      ? 'text-red-900'
                      : 'text-gray-900'
                  }`}>
                    Rp. {cashflowAnalysis.cashflow.net.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              {cashflowAnalysis.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Recommendations</h3>
                  <ul className="space-y-1">
                    {cashflowAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks */}
              {cashflowAnalysis.risks.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Potential Risks</h3>
                  <ul className="space-y-1">
                    {cashflowAnalysis.risks.map((risk, index) => (
                      <li key={index} className="text-sm text-red-800">• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {!inventoryInsights ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Click "Generate Analysis" to get inventory insights</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stock Alerts */}
              {inventoryInsights.stockAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
                  {inventoryInsights.stockAlerts.map((alert, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{alert.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)}`}>
                          {alert.urgency} priority
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Current Stock:</span>
                          <span className="ml-2 font-medium">{alert.currentStock} units</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Recommended:</span>
                          <span className="ml-2 font-medium">{alert.recommendedStock} units</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {inventoryInsights.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Inventory Recommendations</h3>
                  <ul className="space-y-1">
                    {inventoryInsights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AIAnalytics
