'use client'

import { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  totalSpent: number
  totalOrders: number
  segment: 'vip' | 'loyal' | 'regular' | 'new' | 'at_risk'
  loyaltyScore: number
}

const CustomerAnalytics = ({ storeId }: { storeId?: string }) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!storeId) return

    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/customers?storeId=${storeId}`)
        if (!res.ok) throw new Error('Failed to fetch customers')
        const data = await res.json()
        // API returns { customers }
        setCustomers(data.customers || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching customers')
        console.error('CustomerAnalytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [storeId])

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'loyal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'regular': return 'bg-green-100 text-green-800 border-green-200'
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'vip': return '👑'
      case 'loyal': return '💙'
      case 'regular': return '✅'
      case 'new': return '🆕'
      case 'at_risk': return '⚠️'
      default: return '👤'
    }
  }

  const getTotalCustomers = () => customers.length
  const getTotalRevenue = () => customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">👥</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Analytics</h2>
          <p className="text-gray-600">Analisis pelanggan dan segmentasi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pelanggan</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalCustomers()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rp. {getTotalRevenue().toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer List</h3>
        <div className="space-y-4">
          {customers.map((customer: Customer) => (
            <div key={customer.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSegmentColor(customer.segment)}`}>
                    {getSegmentIcon(customer.segment)} {customer.segment.toUpperCase()}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Rp. {customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{customer.loyaltyScore}% loyalty</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerAnalytics