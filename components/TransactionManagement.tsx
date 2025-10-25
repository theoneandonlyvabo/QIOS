'use client'

import { useState, useEffect } from 'react'
import { CreditCard, QrCode, Smartphone, CheckCircle, XCircle, Clock, DollarSign, Package, User } from 'lucide-react'

interface Transaction {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  amount: number
  paymentMethod: 'qris' | 'bank_transfer' | 'gopay' | 'dana' | 'ovo' | 'linkaja' | 'shopeepay'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  timestamp: string
  paymentUrl?: string
  virtualAccountNumber?: string
  qrCode?: string
}

interface PaymentMethod {
  id: string
  name: string
  type: 'qris' | 'bank_transfer' | 'ewallet'
  icon: any
  color: string
  enabled: boolean
}

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const paymentMethods: PaymentMethod[] = [
    { id: 'qris', name: 'QRIS', type: 'qris', icon: QrCode, color: 'text-blue-600', enabled: true },
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank_transfer', icon: CreditCard, color: 'text-green-600', enabled: true },
    { id: 'gopay', name: 'GoPay', type: 'ewallet', icon: Smartphone, color: 'text-green-600', enabled: true },
    { id: 'dana', name: 'DANA', type: 'ewallet', icon: Smartphone, color: 'text-blue-600', enabled: true },
    { id: 'ovo', name: 'OVO', type: 'ewallet', icon: Smartphone, color: 'text-purple-600', enabled: true },
    { id: 'linkaja', name: 'LinkAja', type: 'ewallet', icon: Smartphone, color: 'text-orange-600', enabled: true },
    { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet', icon: Smartphone, color: 'text-red-600', enabled: true }
  ]

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        orderId: 'ORDER-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        amount: 150000,
        paymentMethod: 'qris',
        status: 'completed',
        items: [
          { id: '1', name: 'Product A', price: 100000, quantity: 1 },
          { id: '2', name: 'Product B', price: 50000, quantity: 1 }
        ],
        timestamp: '2024-01-15T10:30:00Z',
        qrCode: '00020101021243650016COM.MIDTRANS.WWW...'
      },
      {
        id: '2',
        orderId: 'ORDER-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        amount: 250000,
        paymentMethod: 'gopay',
        status: 'pending',
        items: [
          { id: '3', name: 'Product C', price: 250000, quantity: 1 }
        ],
        timestamp: '2024-01-15T11:15:00Z',
        paymentUrl: 'https://payment.midtrans.com/...'
      },
      {
        id: '3',
        orderId: 'ORDER-003',
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        amount: 300000,
        paymentMethod: 'bank_transfer',
        status: 'pending',
        items: [
          { id: '4', name: 'Product D', price: 300000, quantity: 1 }
        ],
        timestamp: '2024-01-15T12:00:00Z',
        virtualAccountNumber: '1234567890'
      },
      {
        id: '4',
        orderId: 'ORDER-004',
        customerName: 'Alice Brown',
        customerEmail: 'alice@example.com',
        amount: 100000,
        paymentMethod: 'dana',
        status: 'failed',
        items: [
          { id: '5', name: 'Product E', price: 100000, quantity: 1 }
        ],
        timestamp: '2024-01-15T13:30:00Z'
      }
    ]
    setTransactions(mockTransactions)
  }, [])

  const getPaymentMethodIcon = (method: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === method)
    if (!paymentMethod) return <CreditCard className="w-4 h-4 text-gray-600" />
    const Icon = paymentMethod.icon
    return <Icon className={`w-4 h-4 ${paymentMethod.color}`} />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.status === filter
  })

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const createNewTransaction = () => {
    setShowPaymentModal(true)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
            <p className="text-gray-600">Kelola transaksi dan pembayaran</p>
          </div>
        </div>
        <button
          onClick={createNewTransaction}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            Rp. {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Pending Amount</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            Rp. {pendingAmount.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Transactions</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{transactions.length}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'all', label: 'All', count: transactions.length },
          { id: 'pending', label: 'Pending', count: transactions.filter(t => t.status === 'pending').length },
          { id: 'completed', label: 'Completed', count: transactions.filter(t => t.status === 'completed').length },
          { id: 'failed', label: 'Failed', count: transactions.filter(t => t.status === 'failed').length }
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

      {/* Transactions List */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{transaction.customerName}</h4>
                    <p className="text-sm text-gray-600">{transaction.customerEmail}</p>
                    <p className="text-sm text-gray-500">Order: {transaction.orderId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">
                      Rp. {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="px-3 py-1 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              {/* Items */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                <div className="flex flex-wrap gap-2">
                  {transaction.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {item.name} (x{item.quantity})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.id}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  method.enabled
                    ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${method.color}`} />
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.type}</p>
                <div className={`mt-2 px-2 py-1 rounded-full text-xs ${
                  method.enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {method.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TransactionManagement
