'use client'

import { 
  List, 
  MoreHorizontal, 
  TrendingUp, 
  Smile, 
  BarChart3, 
  Camera, 
  Wallet,
  TrendingDown,
  Minus
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  insight: string
  icon: string
}

const MetricCard = ({ title, value, trend, insight, icon }: MetricCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'List':
        return <List className="w-5 h-5" />
      case 'MoreHorizontal':
        return <MoreHorizontal className="w-5 h-5" />
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />
      case 'Smile':
        return <Smile className="w-5 h-5" />
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />
      case 'Camera':
        return <Camera className="w-5 h-5" />
      case 'Wallet':
        return <Wallet className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-warning-600" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success-600'
      case 'down':
        return 'text-warning-600'
      case 'neutral':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {title === 'Paid Invoices' || title === 'Upcoming Invoices' ? (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">n/a</span>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        
        {title === 'Product Trend' || title === 'Retention' ? (
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-400">0%</span>
            </div>
          </div>
        ) : null}

        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {insight}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
