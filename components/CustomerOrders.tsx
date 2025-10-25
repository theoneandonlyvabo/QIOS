'use client'

import { User, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'

const CustomerOrders = () => {
  const orders = [
    {
      id: 1,
      name: 'Nama',
      location: 'Lokasi',
      date: 'DD/MM/YYYY',
      status: 'Dikonfirmasi',
      amount: 'Rp.0',
      isCancelled: false
    },
    {
      id: 2,
      name: 'Nama',
      location: 'Lokasi',
      date: 'DD/MM/YYYY',
      status: 'Dikonfirmasi',
      amount: 'Rp.0',
      isCancelled: false
    },
    {
      id: 3,
      name: 'Nama',
      location: 'Lokasi',
      date: 'DD/MM/YYYY',
      status: 'Dibatalkan',
      amount: 'Rp.0',
      isCancelled: true
    },
    {
      id: 4,
      name: 'Nama',
      location: 'Lokasi',
      date: 'DD/MM/YYYY',
      status: 'Dikonfirmasi',
      amount: 'Rp.0',
      isCancelled: false
    }
  ]

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
                order.status === 'Confirmed' 
                  ? 'text-success-600' 
                  : 'text-red-600'
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
