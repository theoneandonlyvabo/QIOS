'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Package, DollarSign, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Notification {
  id: string;
  type: 'ORDER' | 'INVENTORY' | 'PAYMENT' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  createdAt: string;
  storeId: string;
  actionUrl?: string;
  additionalData?: Record<string, any>;
}

interface NotificationCenterProps {
  storeId: string;
}

interface Notification {
  id: string;
  type: 'ORDER' | 'INVENTORY' | 'PAYMENT' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  createdAt: string;
}

const NotificationCenter = ({ storeId }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'ORDER' | 'INVENTORY' | 'PAYMENT' | 'SYSTEM'>('all');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/notifications?storeId=${storeId}&limit=${showAll ? 100 : 10}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setNotifications(data.notifications);
        } else {
          setError(data.message || 'Failed to fetch notifications');
        }
      } catch (error) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [storeId, showAll]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'INVENTORY':
        return <Package className="w-5 h-5 text-orange-600" />
      case 'PAYMENT':
        return <DollarSign className="w-5 h-5 text-green-600" />
      case 'SYSTEM':
        return <AlertTriangle className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'ERROR':
        return 'border-red-200 bg-red-50'
      case 'WARNING':
        return 'border-yellow-200 bg-yellow-50'
      case 'SUCCESS':
        return 'border-green-200 bg-green-50'
      case 'INFO':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getSeverityIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'INFO':
        return <Bell className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: id,
          storeId
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAllRead: true,
          storeId
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

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
          { id: 'ORDER', label: 'Orders', count: notifications.filter(n => n.type === 'ORDER').length },
          { id: 'INVENTORY', label: 'Inventory', count: notifications.filter(n => n.type === 'INVENTORY').length },
          { id: 'PAYMENT', label: 'Payments', count: notifications.filter(n => n.type === 'PAYMENT').length },
          { id: 'SYSTEM', label: 'System', count: notifications.filter(n => n.type === 'SYSTEM').length }
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          (showAll ? filteredNotifications : filteredNotifications.slice(0, 10)).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                notification.isRead ? 'bg-white' : 'bg-blue-50'
              } ${getSeverityColor(notification.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${notification.isRead ? 'text-gray-900' : 'text-primary-900'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(notification.severity)}
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  
                  {notification.actionUrl && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          window.location.href = notification.actionUrl!;
                          markAsRead(notification.id);
                        }}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                      >
                        View Details
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
          ))
        )}
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
