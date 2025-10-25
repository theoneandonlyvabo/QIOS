import axios from 'axios'

export interface UtilityConfig {
  apiKey: string
  baseUrl: string
}

export interface UtilityPaymentRequest {
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  amount: number
  referenceNumber: string
  description: string
}

export class PLNGateway {
  private config: UtilityConfig

  constructor(config: UtilityConfig) {
    this.config = config
  }

  async createPayment(request: UtilityPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          customerId: request.customerId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          customerEmail: request.customerEmail,
          amount: request.amount,
          referenceNumber: request.referenceNumber,
          description: request.description,
          paymentType: 'PLN',
          callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/callback',
          redirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
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
        paymentUrl: response.data.paymentUrl,
        virtualAccountNumber: response.data.virtualAccountNumber,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async verifyPayment(referenceNumber: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/payment/status/${referenceNumber}`,
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
        paymentType: 'PLN',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async checkBill(customerId: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/bill/check/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data,
        billAmount: response.data.billAmount,
        dueDate: response.data.dueDate,
        status: response.data.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}

export class PDAMGateway {
  private config: UtilityConfig

  constructor(config: UtilityConfig) {
    this.config = config
  }

  async createPayment(request: UtilityPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          customerId: request.customerId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          customerEmail: request.customerEmail,
          amount: request.amount,
          referenceNumber: request.referenceNumber,
          description: request.description,
          paymentType: 'PDAM',
          callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/callback',
          redirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
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
        paymentUrl: response.data.paymentUrl,
        virtualAccountNumber: response.data.virtualAccountNumber,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async verifyPayment(referenceNumber: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/payment/status/${referenceNumber}`,
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
        paymentType: 'PDAM',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async checkBill(customerId: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/bill/check/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      )

      return {
        success: true,
        data: response.data,
        billAmount: response.data.billAmount,
        dueDate: response.data.dueDate,
        status: response.data.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}
