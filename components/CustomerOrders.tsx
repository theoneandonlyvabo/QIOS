'use client'

import React, { useEffect, useState } from 'react'
import { User, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { Order } from '../types'

const CustomerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/orders')
        if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`)
        const payload = await res.json()
        // Support standardized APIResponse or raw array
        const data = payload?.data ?? payload
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

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
          className={`flex items-center justify-between p-3 rounded-lg border ${
            order.isCancelled
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
                <span className="font-medium text-gray-900 dark:text-white">{order.name}</span>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{order.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{order.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Amount */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {order.status === 'Dikonfirmasi' ? (
                <CheckCircle className="w-4 h-4 text-success-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                order.status === 'Dikonfirmasi' ? 'text-success-600' : 'text-red-600'
              }`}>
                {order.status}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{order.amount}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomerOrders
