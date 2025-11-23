'use client'

import React, { useEffect, useState } from 'react'
import { User, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'

interface OrderItem {
  product: {
    name: string
    sku: string
  }
  quantity: number
  price: number
  subtotal: number
}

interface OrderData {
  id: string
  orderNumber: string
  customer: {
    name: string
    phone?: string
  }
  total: number
  status: string
  paymentStatus: string
  transactionDate: string
  items: OrderItem[]
}

interface CustomerOrdersProps {
  orders?: any[] // Accept data from Dashboard
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialOrders) {
      // Map Dashboard data to OrderData structure
      const mappedOrders = initialOrders.map(order => ({
        ...order,
        transactionDate: order.transactionDate || order.date, // Handle both key names
        customer: typeof order.customer === 'string'
          ? { name: order.customer }
          : order.customer
      }))
      setOrders(mappedOrders)
      return
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Get storeId from environment or use default
        const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || 'cmiby6xvg0000qx62zrfzoic1'
        const res = await fetch(`/api/orders?storeId=${storeId}&limit=10`)
        if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`)
        const payload = await res.json()
        setOrders(payload.orders || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [initialOrders])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg border bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-300 rounded w-48" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="w-24 h-4 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error loading orders: {error}</div>
  }

  if (!orders.length) {
    return <div className="text-gray-500">Belum ada pesanan.</div>
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${order.status === 'CANCELLED'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
        >
          <div className="flex items-center space-x-3">
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Order Details */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{order.customer.name}</span>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{order.orderNumber}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(order.transactionDate).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Amount */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {order.status === 'COMPLETED' ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${order.status === 'COMPLETED' ? 'text-success-600' : 'text-red-600'
                }`}>
                {order.status}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Rp {order.total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomerOrders
