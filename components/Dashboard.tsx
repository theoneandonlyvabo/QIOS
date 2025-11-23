'use client'

import { useState, useEffect } from 'react'
import { Calendar, Moon, Sun, User, Loader2 } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import { formatCurrency } from '@/lib/utils'
import CustomerOrders from '@/components/CustomerOrders'
import TeamManagement from '@/components/TeamManagement'
import NotificationCenter from '@/components/NotificationCenter'
import CustomerAnalytics from '@/components/CustomerAnalytics'
import TransactionManagement from '@/components/TransactionManagement'
import AIAnalytics from '@/components/AIAnalytics'
import InventoryManagement from '@/components/InventoryManagement'
import dynamic from 'next/dynamic'

const SalesChart = dynamic(() => import('@/components/SalesChart'), { ssr: false })
const UserActivityChart = dynamic(() => import('@/components/UserActivityChart'), { ssr: false })

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeCustomers: number;
  lowStockAlert: {
    count: number;
    products: Array<{
      id: string;
      name: string;
      sku: string;
      stockQuantity: number;
      minStockLevel: number;
    }>;
  };
}

interface DashboardProps {
  activeView?: string;
  storeId: string;
}

interface Transaction {
  id: string;
  orderNumber: string;
  customer: string;
  customerSegment: string;
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

const Dashboard = ({ activeView = 'overview', storeId }: DashboardProps) => {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2025-11-01',
    end: '2025-11-30'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ZERO_DASHBOARD: DashboardMetrics = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeCustomers: 0,
    lowStockAlert: {
      count: 0,
      products: []
    }
  }

  const [dashboardData, setDashboardData] = useState<DashboardMetrics>(ZERO_DASHBOARD)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [chartData, setChartData] = useState<{ sales: any[], activity: any[] }>({ sales: [], activity: [] })

  useEffect(() => {
    if (!storeId) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch metrics
        const metricsResponse = await fetch(
          `/api/dashboard/metrics?storeId=${storeId}&startDate=${dateRange.start}&endDate=${dateRange.end}`
        );
        const metricsData = await metricsResponse.json();

        if (metricsData.status === 'success') {
          setDashboardData(metricsData.metrics);
          setRecentTransactions(metricsData.recentTransactions);
        }

        // Fetch chart data
        const chartsResponse = await fetch(
          `/api/dashboard/charts?storeId=${storeId}&startDate=${dateRange.start}&endDate=${dateRange.end}`
        );
        const chartsData = await chartsResponse.json();

        if (chartsData.success) {
          setChartData(chartsData.data);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [storeId, dateRange]);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [type]: value }))
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const getMetrics = () => {
    if (!dashboardData) return [];

    return [
      {
        title: 'Total Pesanan',
        value: dashboardData.totalOrders.toString(),
        trend: 'up' as const,
        insight: 'Total pesanan keseluruhan',
        icon: 'List'
      },
      {
        title: 'Pesanan Tertunda',
        value: dashboardData.pendingOrders.toString(),
        trend: dashboardData.pendingOrders > 5 ? 'down' : 'up' as const,
        insight: 'Pesanan yang perlu diproses',
        icon: 'MoreHorizontal'
      },
      {
        title: 'Stok Menipis',
        value: dashboardData.lowStockAlert.count.toString(),
        trend: dashboardData.lowStockAlert.count > 0 ? 'down' : 'up' as const,
        insight: `${dashboardData.lowStockAlert.count} produk perlu restock`,
        icon: 'AlertTriangle'
      },
      {
        title: 'Pelanggan Aktif',
        value: dashboardData.activeCustomers.toString(),
        trend: 'up' as const,
        insight: 'Pelanggan dalam 30 hari terakhir',
        icon: 'Users'
      },
      {
        title: 'Pendapatan Total',
        value: formatCurrency(dashboardData.totalRevenue),
        trend: 'up' as const,
        insight: 'Total pendapatan dari pesanan selesai',
        icon: 'DollarSign'
      }
    ];
  };

  const getPageTitle = (view: string) => {
    const titles: Record<string, string> = {
      overview: 'Dashboard',
      analytics: 'Analitik',
      inventory: 'Manajemen Stok',
      customers: 'Manajemen Pelanggan',
      transactions: 'Transaksi',
    }
    return titles[view] || 'Dashboard'
  }

  const renderContent = () => {
    switch (activeView) {
      case 'analytics':
        return <AIAnalytics />

      case 'inventory':
        return <InventoryManagement storeId={storeId} />

      case 'notifications':
        return <NotificationCenter storeId={storeId} />

      case 'customers':
        return <CustomerAnalytics storeId={storeId} />

      case 'team':
        return <TeamManagement />

      case 'transactions':
        return <TransactionManagement />

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {getPageTitle(activeView)}
              </h1>

              <div className="flex items-center space-x-6">
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

                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                  >
                    <div
                      className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'
                        } top-1`}
                    />
                  </button>
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>

                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <span className="text-sm">Nama Bisnis Anda</span>
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-red-600 p-4">
                  {error}
                </div>
              ) : dashboardData ? (
                getMetrics().map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    trend={metric.trend as 'up' | 'down' | 'neutral'}
                    insight={metric.insight}
                    icon={metric.icon}
                  />
                ))
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Penjualan</h3>
                </div>
                <SalesChart data={chartData.sales} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pesanan Pelanggan</h3>
                  <div className="w-5 h-5 text-gray-400 dark:text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                    </svg>
                  </div>
                </div>
                <CustomerOrders orders={recentTransactions} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aktivitas Pengguna</h3>
              </div>
              <UserActivityChart data={chartData.activity} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-6">
      {renderContent()}
    </div>
  )
}

export default Dashboard