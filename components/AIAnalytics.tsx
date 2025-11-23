'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Package, DollarSign, Calendar } from 'lucide-react'

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

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'trend':
    case 'growth':
    case 'opportunity':
      return <TrendingUp className="w-5 h-5 text-blue-600" />
    case 'warning':
    case 'risk':
    case 'challenge':
      return <AlertTriangle className="w-5 h-5 text-red-600" />
    case 'recommendation':
    case 'strategy':
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

const AIAnalytics = () => {
  const [insights, setInsights] = useState<BusinessInsight[]>([])
  const [cashflowAnalysis, setCashflowAnalysis] = useState<CashflowAnalysis | null>(null)
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null)
  const [growthInsights, setGrowthInsights] = useState<BusinessInsight[]>([])
  const [monthlyInsights, setMonthlyInsights] = useState<BusinessInsight[]>([])
  const [trendInsights, setTrendInsights] = useState<BusinessInsight[]>([])
  const [riskInsights, setRiskInsights] = useState<BusinessInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [businessData, setBusinessData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<
    'business' |
    'cashflow' |
    'inventory' |
    'growth' |
    'monthly' |
    'trends' |
    'risks'
  >('business')

  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2025-11-01',
    end: '2025-11-30'
  })

  // Fetch real business data from database
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || 'cmiby6xvg0000qx62zrfzoic1'
        const response = await fetch(
          `/api/analytics/business-data?storeId=${storeId}&startDate=${dateRange.start}&endDate=${dateRange.end}`
        )
        const result = await response.json()
        if (result.success) {
          setBusinessData(result.data)
        }
      } catch (error) {
        console.error('Error fetching business data:', error)
      }
    }
    fetchBusinessData()
  }, [dateRange])

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [type]: value }))
  }

  const generateInsights = async () => {
    if (!businessData) {
      console.error('No business data available')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
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
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/cashflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
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
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
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

  const generateGrowthAnalysis = async () => {
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/growth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setGrowthInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating growth analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMonthlyEvaluation = async () => {
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setMonthlyInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating monthly evaluation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateTrendPrediction = async () => {
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setTrendInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating trend prediction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateRiskMitigation = async () => {
    if (!businessData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/risks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setRiskInsights(result.data)
      }
    } catch (error) {
      console.error('Error generating risk mitigation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAllAnalytics = async () => {
    if (!businessData) {
      alert('Sedang memuat data bisnis, mohon tunggu sebentar...')
      return
    }

    setIsLoading(true)
    try {
      // Generate all analytics in parallel
      await Promise.all([
        generateInsights(),
        generateCashflowAnalysis(),
        generateInventoryInsights(),
        generateGrowthAnalysis(),
        generateMonthlyEvaluation(),
        generateTrendPrediction(),
        generateRiskMitigation()
      ])
    } finally {
      setIsLoading(false)
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400"
            />
          </div>
          <button
            onClick={generateAllAnalytics}
            disabled={isLoading || !businessData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Menganalisis...' : !businessData ? 'Memuat Data...' : 'Hasilkan Analisis Lengkap'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'business'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Wawasan Bisnis
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'cashflow'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Analisis Arus Kas
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'inventory'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Wawasan Inventori
        </button>
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'growth'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Analisis Pertumbuhan
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'monthly'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Evaluasi Bulanan
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'trends'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Prediksi Tren
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === 'risks'
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
              <p className="text-gray-500 dark:text-gray-400">Klik "Hasilkan Analisis Lengkap" untuk mendapatkan wawasan bisnis berbasis AI</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
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
                <div className={`p-4 border rounded-lg ${cashflowAnalysis.cashflow.trend === 'positive'
                  ? 'bg-green-50 border-green-200'
                  : cashflowAnalysis.cashflow.trend === 'negative'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className={`w-5 h-5 ${cashflowAnalysis.cashflow.trend === 'positive'
                      ? 'text-green-600'
                      : cashflowAnalysis.cashflow.trend === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                      }`} />
                    <span className={`text-sm font-medium ${cashflowAnalysis.cashflow.trend === 'positive'
                      ? 'text-green-800'
                      : cashflowAnalysis.cashflow.trend === 'negative'
                        ? 'text-red-800'
                        : 'text-gray-800'
                      }`}>Net Cashflow</span>
                  </div>
                  <p className={`text-2xl font-bold ${cashflowAnalysis.cashflow.trend === 'positive'
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
      {activeTab === 'growth' && (
        <div className="space-y-4">
          {growthInsights.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Klik "Hasilkan Analisis Lengkap" untuk mendapatkan analisis pertumbuhan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {growthInsights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="space-y-4">
          {monthlyInsights.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Klik "Hasilkan Analisis Lengkap" untuk mendapatkan evaluasi bulanan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monthlyInsights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-4">
          {trendInsights.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Klik "Hasilkan Analisis Lengkap" untuk mendapatkan prediksi tren</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendInsights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-4">
          {riskInsights.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Klik "Hasilkan Analisis Lengkap" untuk mendapatkan mitigasi risiko</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskInsights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper component for rendering insights
const InsightCard = ({ insight }: { insight: BusinessInsight }) => {


  return (
    <div className={`p-4 border rounded-lg ${getImpactColor(insight.impact)}`}>
      <div className="flex items-start space-x-3">
        {getInsightIcon(insight.type)}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
          <div className="text-sm text-gray-700 mb-3 space-y-2">
            {insight.description.split('\n').map((line, i) => {
              // Handle bullet points
              const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•')
              // Handle numbered lists (e.g., "1. ", "2. ")
              const isNumbered = /^\d+\.\s/.test(line.trim())

              let cleanLine = line
              if (isBullet) cleanLine = line.replace(/^[-*•]\s*/, '')
              // Keep the number for numbered lists but maybe style it? 
              // Actually, let's keep the number but indent it.

              // Handle bold text parsing
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g)

              return (
                <p key={i} className={`leading-relaxed ${isBullet || isNumbered ? 'pl-4 relative mb-1' : 'mb-2'}`}>
                  {isBullet && (
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  )}
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                    }
                    return <span key={j}>{part}</span>
                  })}
                </p>
              )
            })}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {insight.type} • Impact: {insight.impact}
            </span>
            {insight.actionable && (
              <span className="text-xs bg-white/50 text-gray-700 px-2 py-1 rounded border border-gray-200">
                Actionable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalytics
