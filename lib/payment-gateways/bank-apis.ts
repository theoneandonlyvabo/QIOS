import axios from 'axios'

export interface BankConfig {
  apiKey: string
  baseUrl: string
  merchantId: string
}

export interface BankPaymentRequest {
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

export class BCAGateway {
  private config: BankConfig

  constructor(config: BankConfig) {
    this.config = config
  }

  async createVirtualAccount(request: BankPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/virtual-account`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        data: response.data,
        virtualAccountNumber: response.data.virtualAccountNumber,
        paymentUrl: response.data.paymentUrl,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async verifyPayment(orderId: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/payment-status/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data,
        status: response.data.status,
        paymentType: 'BCA_VIRTUAL_ACCOUNT',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}

export class MandiriGateway {
  private config: BankConfig

  constructor(config: BankConfig) {
    this.config = config
  }

  async createVirtualAccount(request: BankPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/virtual-account`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        data: response.data,
        virtualAccountNumber: response.data.virtualAccountNumber,
        paymentUrl: response.data.paymentUrl,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async verifyPayment(orderId: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/payment-status/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data,
        status: response.data.status,
        paymentType: 'MANDIRI_VIRTUAL_ACCOUNT',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}
