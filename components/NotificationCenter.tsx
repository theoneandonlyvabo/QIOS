'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Package, DollarSign, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'operational' | 'customer' | 'supplier' | 'ai' | 'system'
  category: 'stock' | 'payment' | 'trend' | 'order' | 'promo' | 'review' | 'restock' | 'delivery' | 'invoice' | 'insight' | 'milestone' | 'anomaly'
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  timestamp: string
  read: boolean
  actionable: boolean
  action?: string
  data?: any
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'operational' | 'customer' | 'supplier' | 'ai'>('all')
  const [showAll, setShowAll] = useState(false)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'operational',
        category: 'stock',
        title: 'Stok Menipis',
        message: 'Produk A hanya tersisa 5 unit. Segera restock untuk menghindari kehabisan.',
        priority: 'high',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        actionable: true,
        action: 'Restock Now',
        data: { productId: 'A', currentStock: 5, minStock: 10 }
      },
      {
        id: '2',
        type: 'operational',
        category: 'payment',
        title: 'Tagihan Jatuh Tempo',
        message: 'Tagihan PLN akan jatuh tempo dalam 2 hari. Jumlah: Rp. 500,000',
        priority: 'high',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
        actionable: true,
        action: 'Pay Now',
        data: { billType: 'PLN', amount: 500000, dueDate: '2024-01-17' }
      },
      {
        id: '3',
        type: 'customer',
        category: 'order',
        title: 'Pesanan Baru',
        message: 'Pesanan #12345 dari John Doe telah diterima. Total: Rp. 150,000',
        priority: 'medium',
        timestamp: '2024-01-15T08:45:00Z',
        read: true,
        actionable: true,
        action: 'View Order',
        data: { orderId: '12345', customer: 'John Doe', amount: 150000 }
      },
      {
        id: '4',
        type: 'customer',
        category: 'review',
        title: 'Review Baru',
        message: 'Jane Smith memberikan rating 5 bintang untuk Produk B',
        priority: 'low',
        timestamp: '2024-01-15T07:20:00Z',
        read: true,
        actionable: false
      },
      {
        id: '5',
        type: 'supplier',
        category: 'restock',
        title: 'Permintaan Restock',
        message: 'Supplier ABC mengkonfirmasi pengiriman 100 unit Produk A untuk besok',
        priority: 'medium',
        timestamp: '2024-01-15T06:30:00Z',
        read: false,
        actionable: true,
        action: 'Track Delivery',
        data: { supplier: 'ABC', product: 'A', quantity: 100, deliveryDate: '2024-01-16' }
      },
      {
        id: '6',
        type: 'ai',
        category: 'insight',
        title: 'AI Business Insight',
        message: 'Penjualan meningkat 15% minggu ini. Pertimbangkan untuk meningkatkan stok produk populer.',
        priority: 'medium',
        timestamp: '2024-01-15T05:00:00Z',
        read: false,
        actionable: true,
        action: 'View Insights',
        data: { growth: 15, recommendation: 'increase_stock' }
      },
      {
        id: '7',
        type: 'ai',
        category: 'anomaly',
        title: 'Anomali Terdeteksi',
        message: 'Deteksi penurunan penjualan 30% untuk Produk C. Periksa kualitas atau harga.',
        priority: 'high',
        timestamp: '2024-01-14T22:15:00Z',
        read: false,
        actionable: true,
        action: 'Investigate',
        data: { product: 'C', decline: 30, suggestion: 'check_quality_price' }
      },
      {
        id: '8',
        type: 'system',
        category: 'milestone',
        title: 'Milestone Tercapai',
        message: 'Selamat! Anda telah mencapai target penjualan bulanan. Reward: 5% bonus untuk tim.',
        priority: 'low',
        timestamp: '2024-01-14T18:00:00Z',
        read: true,
        actionable: false
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'operational') {
      switch (category) {
        case 'stock':
          return <Package className="w-5 h-5 text-orange-600" />
        case 'payment':
          return <DollarSign className="w-5 h-5 text-red-600" />
        default:
          return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      }
    }
    if (type === 'customer') {
      return <Users className="w-5 h-5 text-blue-600" />
    }
    if (type === 'supplier') {
      return <Package className="w-5 h-5 text-green-600" />
    }
    if (type === 'ai') {
      return <TrendingUp className="w-5 h-5 text-purple-600" />
    }
    return <Bell className="w-5 h-5 text-gray-600" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Baru saja'
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} hari yang lalu`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
            <p className="text-gray-600">Notifikasi operasional dan bisnis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Mark all as read
            </button>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Unread:</span>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {unreadCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'operational', label: 'Operational', count: notifications.filter(n => n.type === 'operational').length },
          { id: 'customer', label: 'Customer', count: notifications.filter(n => n.type === 'customer').length },
          { id: 'supplier', label: 'Supplier', count: notifications.filter(n => n.type === 'supplier').length },
          { id: 'ai', label: 'AI Insights', count: notifications.filter(n => n.type === 'ai').length }
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              filter === id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{label}</span>
            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {(showAll ? filteredNotifications : filteredNotifications.slice(0, 10)).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            } ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type, notification.category)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(notification.priority)}
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                
                {notification.actionable && notification.action && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                    >
                      {notification.action}
                    </button>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-3 py-1 text-gray-600 text-sm hover:text-gray-900 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {filteredNotifications.length > 10 && !showAll && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            Show All Notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
