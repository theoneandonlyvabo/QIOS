'use client'

import { useState } from 'react'
import { X, CreditCard, Smartphone, Zap, Droplets, QrCode } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  amount: number
  customerDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  itemDetails: Array<{
    id: string
    price: number
    quantity: number
    name: string
  }>
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  amount, 
  customerDetails, 
  itemDetails 
}: PaymentModalProps) => {
  const [selectedGateway, setSelectedGateway] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)

  const paymentGateways = [
    {
      id: 'midtrans',
      name: 'Midtrans',
      icon: CreditCard,
      methods: [
        { id: 'bank_transfer', name: 'Bank Transfer', icon: CreditCard },
        { id: 'gopay', name: 'GoPay', icon: Smartphone },
        { id: 'shopeepay', name: 'ShopeePay', icon: Smartphone },
        { id: 'dana', name: 'DANA', icon: Smartphone },
        { id: 'ovo', name: 'OVO', icon: Smartphone },
        { id: 'linkaja', name: 'LinkAja', icon: Smartphone },
      ]
    },
    {
      id: 'xendit',
      name: 'Xendit',
      icon: QrCode,
      methods: [
        { id: 'virtual_account', name: 'Virtual Account', icon: CreditCard },
        { id: 'qris', name: 'QRIS', icon: QrCode },
        { id: 'OVO', name: 'OVO', icon: Smartphone },
        { id: 'DANA', name: 'DANA', icon: Smartphone },
        { id: 'LINKAJA', name: 'LinkAja', icon: Smartphone },
        { id: 'SHOPEEPAY', name: 'ShopeePay', icon: Smartphone },
      ]
    },
    {
      id: 'bca',
      name: 'BCA',
      icon: CreditCard,
      methods: [
        { id: 'virtual_account', name: 'Virtual Account', icon: CreditCard }
      ]
    },
    {
      id: 'mandiri',
      name: 'Mandiri',
      icon: CreditCard,
      methods: [
        { id: 'virtual_account', name: 'Virtual Account', icon: CreditCard }
      ]
    },
    {
      id: 'pln',
      name: 'PLN',
      icon: Zap,
      methods: [
        { id: 'utility', name: 'Electricity Bill', icon: Zap }
      ]
    },
    {
      id: 'pdam',
      name: 'PDAM',
      icon: Droplets,
      methods: [
        { id: 'utility', name: 'Water Bill', icon: Droplets }
      ]
    }
  ]

  const handlePayment = async () => {
    if (!selectedGateway || !selectedMethod) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gatewayType: selectedGateway,
          paymentMethod: selectedMethod,
          orderId,
          amount,
          customerDetails,
          itemDetails,
        }),
      })

      const result = await response.json()
      setPaymentResult(result)
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Gateway</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Payment Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">Rp. {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">
                {customerDetails.firstName} {customerDetails.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Gateway Selection */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Gateway</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paymentGateways.map((gateway) => {
              const Icon = gateway.icon
              return (
                <button
                  key={gateway.id}
                  onClick={() => setSelectedGateway(gateway.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedGateway === gateway.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-900">{gateway.name}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Payment Method Selection */}
          {selectedGateway && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentGateways
                  .find(g => g.id === selectedGateway)
                  ?.methods.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          selectedMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Payment Result */}
          {paymentResult && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Payment Created</h4>
              {paymentResult.paymentUrl && (
                <div className="mb-2">
                  <a
                    href={paymentResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Click here to complete payment
                  </a>
                </div>
              )}
              {paymentResult.virtualAccountNumber && (
                <div className="mb-2">
                  <span className="text-gray-600">Virtual Account: </span>
                  <span className="font-mono font-medium">{paymentResult.virtualAccountNumber}</span>
                </div>
              )}
              {paymentResult.qrCode && (
                <div className="mb-2">
                  <span className="text-gray-600">QR Code: </span>
                  <span className="font-mono font-medium text-sm">{paymentResult.qrCode}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedGateway || !selectedMethod || isProcessing}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Create Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
