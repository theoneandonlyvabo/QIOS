'use client'

import { useState } from 'react'
import MetricCard from '@/components/MetricCard'
import SalesChart from '@/components/SalesChart'
import CustomerOrders from '@/components/CustomerOrders'
import UserActivityChart from '@/components/UserActivityChart'
import CalendarDashboard from '@/components/CalendarDashboard'
import AICompanion from '@/components/AICompanion'
import TeamManagement from '@/components/TeamManagement'
import NotificationCenter from '@/components/NotificationCenter'
import CustomerAnalytics from '@/components/CustomerAnalytics'
import TransactionManagement from '@/components/TransactionManagement'

interface DashboardProps {
  activeView?: string
}

const Dashboard = ({ activeView = 'overview' }: DashboardProps) => {
  const [selectedYear, setSelectedYear] = useState('2024')

  const metrics = [
    {
      title: 'Orders',
      value: 'n/a',
      trend: 'up',
      insight: 'Business Insight',
      icon: 'List'
    },
    {
      title: 'Pending',
      value: 'n/a',
      trend: 'down',
      insight: 'Business Insight',
      icon: 'MoreHorizontal'
    },
    {
      title: 'Product Trend',
      value: '0% n/a',
      trend: 'neutral',
      insight: '0% n/a',
      icon: 'TrendingUp'
    },
    {
      title: 'Retention',
      value: '0% n/a',
      trend: 'neutral',
      insight: '0% n/a',
      icon: 'Smile'
    },
    {
      title: 'Month Total',
      value: 'n/a',
      trend: 'up',
      insight: 'Business Insight',
      icon: 'BarChart3'
    },
    {
      title: 'Revenue',
      value: 'n/a',
      trend: 'up',
      insight: 'Business Insight',
      icon: 'Camera'
    },
    {
      title: 'Paid Invoices',
      value: 'Rp. n/a',
      trend: 'neutral',
      insight: 'Business Insight',
      icon: 'Wallet'
    },
    {
      title: 'Upcoming Invoices',
      value: 'Rp. n/a',
      trend: 'neutral',
      insight: 'Business Insight',
      icon: 'Wallet'
    }
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarDashboard />
      case 'ai':
        return <AICompanion />
      case 'team':
        return <TeamManagement />
      case 'notifications':
        return <NotificationCenter />
      case 'customers':
        return <CustomerAnalytics />
      case 'transactions':
        return <TransactionManagement />
      default:
        return (
          <div className="space-y-6">
            {/* Page Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            insight={metric.insight}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales</h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <SalesChart year={selectedYear} />
        </div>

        {/* Customer Orders */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Order</h3>
            <div className="w-5 h-5 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
              </svg>
            </div>
          </div>
          <CustomerOrders />
        </div>
      </div>

            {/* User Activity Chart */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall User Activity</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <UserActivityChart year={selectedYear} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  )
}

export default Dashboard
