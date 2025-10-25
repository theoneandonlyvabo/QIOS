'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, BarChart3, Users, DollarSign } from 'lucide-react'

interface BusinessInsight {
  id: string
  type: 'growth' | 'evaluation' | 'prediction' | 'risk' | 'benchmark'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
  action?: string
  confidence: number
  category: 'revenue' | 'customer' | 'inventory' | 'expense' | 'strategy'
}

interface GrowthAnalysis {
  revenueGrowth: number
  customerRetention: number
  promotionEffectiveness: number
  recommendations: string[]
}

interface MonthlyEvaluation {
  month: string
  performance: 'excellent' | 'good' | 'average' | 'poor'
  keyMetrics: {
    revenue: number
    expenses: number
    profit: number
    customerCount: number
  }
  insights: string[]
}

interface TrendPrediction {
  product: string
  predictedDemand: number
  confidence: number
  timeframe: string
  recommendations: string[]
}

interface RiskMitigation {
  risk: string
  severity: 'high' | 'medium' | 'low'
  description: string
  mitigation: string[]
}

const AICompanion = () => {
  const [insights, setInsights] = useState<BusinessInsight[]>([])
  const [growthAnalysis, setGrowthAnalysis] = useState<GrowthAnalysis | null>(null)
  const [monthlyEvaluation, setMonthlyEvaluation] = useState<MonthlyEvaluation | null>(null)
  const [trendPrediction, setTrendPrediction] = useState<TrendPrediction[]>([])
  const [riskMitigation, setRiskMitigation] = useState<RiskMitigation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'insights' | 'growth' | 'evaluation' | 'prediction' | 'risk'>('insights')

  // Mock data - in real app, this would come from AI API
  useEffect(() => {
    const mockInsights: BusinessInsight[] = [
      {
        id: '1',
        type: 'growth',
        title: 'Pertumbuhan Revenue Positif',
        description: 'Revenue menunjukkan peningkatan 15% dari bulan sebelumnya dengan tren yang konsisten',
        impact: 'high',
        actionable: true,
        action: 'Pertahankan strategi marketing yang sedang berjalan',
        confidence: 0.85,
        category: 'revenue'
      },
      {
        id: '2',
        type: 'risk',
        title: 'Stok Kritis Terdeteksi',
        description: 'Beberapa produk memiliki stok rendah yang berisiko kehabisan dalam 2-3 hari',
        impact: 'high',
        actionable: true,
        action: 'Segera restock produk dengan stok < 10 unit',
        confidence: 0.92,
        category: 'inventory'
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Prediksi Permintaan Produk A',
        description: 'AI memprediksi peningkatan permintaan 25% untuk Produk A dalam 2 minggu ke depan',
        impact: 'medium',
        actionable: true,
        action: 'Siapkan stok tambahan dan promosi khusus',
        confidence: 0.78,
        category: 'strategy'
      }
    ]

    const mockGrowthAnalysis: GrowthAnalysis = {
      revenueGrowth: 15.2,
      customerRetention: 78.5,
      promotionEffectiveness: 65.3,
      recommendations: [
        'Fokus pada customer retention dengan program loyalty',
        'Optimalkan promosi dengan target segmentasi yang lebih spesifik',
        'Investasi pada produk high-margin untuk meningkatkan profitabilitas'
      ]
    }

    const mockMonthlyEvaluation: MonthlyEvaluation = {
      month: 'Desember 2024',
      performance: 'good',
      keyMetrics: {
        revenue: 15000000,
        expenses: 8000000,
        profit: 7000000,
        customerCount: 1250
      },
      insights: [
        'Revenue meningkat 12% dari bulan sebelumnya',
        'Customer acquisition cost menurun 8%',
        'Profit margin stabil di 46.7%'
      ]
    }

    const mockTrendPrediction: TrendPrediction[] = [
      {
        product: 'Produk A',
        predictedDemand: 150,
        confidence: 0.85,
        timeframe: '2 minggu ke depan',
        recommendations: [
          'Siapkan stok 200 unit',
          'Rencanakan promosi khusus',
          'Koordinasi dengan supplier untuk restock cepat'
        ]
      },
      {
        product: 'Produk B',
        predictedDemand: 80,
        confidence: 0.72,
        timeframe: '1 bulan ke depan',
        recommendations: [
          'Monitor stok secara berkala',
          'Pertimbangkan bundling dengan produk lain'
        ]
      }
    ]

    const mockRiskMitigation: RiskMitigation[] = [
      {
        risk: 'Stok Kritis',
        severity: 'high',
        description: '5 produk memiliki stok < 10 unit',
        mitigation: [
          'Segera hubungi supplier untuk restock',
          'Implementasikan sistem reorder point',
          'Diversifikasi supplier untuk mengurangi risiko'
        ]
      },
      {
        risk: 'Customer Churn',
        severity: 'medium',
        description: '15% customer tidak melakukan pembelian dalam 30 hari terakhir',
        mitigation: [
          'Kirim email marketing dengan promo khusus',
          'Implementasikan program loyalty',
          'Analisis penyebab churn dan perbaiki'
        ]
      }
    ]

    setInsights(mockInsights)
    setGrowthAnalysis(mockGrowthAnalysis)
    setMonthlyEvaluation(mockMonthlyEvaluation)
    setTrendPrediction(mockTrendPrediction)
    setRiskMitigation(mockRiskMitigation)
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'growth':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'evaluation':
        return <BarChart3 className="w-5 h-5 text-blue-600" />
      case 'prediction':
        return <Target className="w-5 h-5 text-purple-600" />
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'benchmark':
        return <Users className="w-5 h-5 text-orange-600" />
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'text-green-600 bg-green-100'
      case 'good':
        return 'text-blue-600 bg-blue-100'
      case 'average':
        return 'text-yellow-600 bg-yellow-100'
      case 'poor':
        return 'text-red-600 bg-red-100'
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
            <h2 className="text-2xl font-bold text-gray-900">AI Companion</h2>
            <p className="text-gray-600">AI-powered business insights dan strategi</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'insights', label: 'Business Insights', icon: Brain },
          { id: 'growth', label: 'Growth Analysis', icon: TrendingUp },
          { id: 'evaluation', label: 'Monthly Evaluation', icon: BarChart3 },
          { id: 'prediction', label: 'Trend Prediction', icon: Target },
          { id: 'risk', label: 'Risk Mitigation', icon: AlertTriangle }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
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
                    {insight.action && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Action:</strong> {insight.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'growth' && growthAnalysis && (
        <div className="space-y-6">
          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Revenue Growth</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                +{growthAnalysis.revenueGrowth}%
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Customer Retention</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {growthAnalysis.customerRetention}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Promotion Effectiveness</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {growthAnalysis.promotionEffectiveness}%
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Growth Recommendations</h3>
            <ul className="space-y-1">
              {growthAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-800">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'evaluation' && monthlyEvaluation && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{monthlyEvaluation.month} Performance</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(monthlyEvaluation.performance)}`}>
                {monthlyEvaluation.performance.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  Rp. {monthlyEvaluation.keyMetrics.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  Rp. {monthlyEvaluation.keyMetrics.expenses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  Rp. {monthlyEvaluation.keyMetrics.profit.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Profit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyEvaluation.keyMetrics.customerCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Customers</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
            <ul className="space-y-1">
              {monthlyEvaluation.insights.map((insight, index) => (
                <li key={index} className="text-sm text-blue-800">• {insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'prediction' && (
        <div className="space-y-4">
          {trendPrediction.map((prediction, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{prediction.product}</h3>
                <span className="text-sm text-gray-600">{prediction.timeframe}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Predicted Demand</p>
                  <p className="text-xl font-bold text-gray-900">{prediction.predictedDemand} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-xl font-bold text-gray-900">{Math.round(prediction.confidence * 100)}%</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-900 mb-1">Recommendations</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {prediction.recommendations.map((rec, recIndex) => (
                    <li key={recIndex}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-4">
          {riskMitigation.map((risk, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{risk.risk}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                  {risk.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-medium text-yellow-900 mb-1">Mitigation Strategies</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {risk.mitigation.map((strategy, strategyIndex) => (
                    <li key={strategyIndex}>• {strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AICompanion
