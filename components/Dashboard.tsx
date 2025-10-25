'use client'

import { useState } from 'react'
import { Calendar, Moon, Sun, User } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import SalesChart from '@/components/SalesChart'
import CustomerOrders from '@/components/CustomerOrders'
import UserActivityChart from '@/components/UserActivityChart'
import TeamManagement from '@/components/TeamManagement'
import NotificationCenter from '@/components/NotificationCenter'
import CustomerAnalytics from '@/components/CustomerAnalytics'
import TransactionManagement from '@/components/TransactionManagement'
import AIAnalytics from '@/components/AIAnalytics'
import InventoryManagement from '@/components/InventoryManagement'

interface DashboardProps {
  activeView?: string
}

const Dashboard = ({ activeView = 'overview' }: DashboardProps) => {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2025-10-01',
    end: '2025-10-31'
  })

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getPageTitle = (view: string) => {
    const titles: Record<string, string> = {
      overview: 'Dashboard',
      analytics: 'Analitik AI',
      inventory: 'Manajemen Stok',
      notifications: 'Notifikasi',
      customers: 'Pelanggan'
    }
    return titles[view] || 'Dasbor'
  }

  const metrics = [
    {
      title: 'Pesanan',
      value: 'n/a',
      trend: 'up' as const,
      insight: 'Wawasan Bisnis',
      icon: 'List'
    },
    {
      title: 'Tertunda',
      value: 'n/a',
      trend: 'down' as const,
      insight: 'Wawasan Bisnis',
      icon: 'MoreHorizontal'
    },
    {
      title: 'Tren Produk',
      value: '0% n/a',
      trend: 'neutral' as const,
      insight: '0% n/a',
      icon: 'TrendingUp'
    },
    {
      title: 'Retensi',
      value: '0% n/a',
      trend: 'neutral' as const,
      insight: '0% n/a',
      icon: 'Smile'
    },
    {
      title: 'Total Bulan',
      value: 'n/a',
      trend: 'up' as const,
      insight: 'Wawasan Bisnis',
      icon: 'BarChart3'
    },
    {
      title: 'Pendapatan',
      value: 'n/a',
      trend: 'up' as const,
      insight: 'Wawasan Bisnis',
      icon: 'Camera'
    },
    {
      title: 'Faktur Dibayar',
      value: 'Rp. n/a',
      trend: 'neutral' as const,
      insight: 'Wawasan Bisnis',
      icon: 'Wallet'
    },
    {
      title: 'Faktur Mendatang',
      value: 'Rp. n/a',
      trend: 'neutral' as const,
      insight: 'Wawasan Bisnis',
      icon: 'Wallet'
    }
  ]

  const renderContent = () => {
    const content = (() => {
      switch (activeView) {
        case 'analytics':
          return <AIAnalytics />
        case 'inventory':
          return <InventoryManagement />
        case 'notifications':
          return <NotificationCenter />
        case 'customers':
          return <CustomerAnalytics />
        case 'team':
          return <TeamManagement />
        case 'transactions':
          return <TransactionManagement />
        default:
          return (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getPageTitle(activeView)}
                </h1>

                <div className="flex items-center space-x-6">
                  {/* Date Range Picker */}
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pilih Rentang Tanggal</span>
                  </button>

                  {/* Dark Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                          isDarkMode ? 'translate-x-7' : 'translate-x-1'
                        } top-1`}
                      />
                    </button>
                    <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>

                  {/* User Profile */}
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span className="text-sm">Nama Bisnis Anda</span>
                    <User className="w-4 h-4" />
                  </button>
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
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Penjualan</h3>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  <SalesChart year={selectedYear} />
                </div>

                {/* Customer Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pesanan Pelanggan</h3>
                    <div className="w-5 h-5 text-gray-400 dark:text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
                      </svg>
                    </div>
                  </div>
                  <CustomerOrders />
                </div>
              </div>

              {/* User Activity Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aktivitas Pengguna</h3>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
    })()

    return content
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-6">
  {renderContent()}
    </div>
  )
}

export default Dashboard
