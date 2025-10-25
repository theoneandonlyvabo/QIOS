import axios from 'axios'

export interface EWalletConfig {
  apiKey: string
  baseUrl: string
  merchantId: string
}

export interface EWalletPaymentRequest {
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

export class DANAGateway {
  private config: EWalletConfig

  constructor(config: EWalletConfig) {
    this.config = config
  }

  async createPayment(request: EWalletPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
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
        deepLink: response.data.deepLink,
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
        `${this.config.baseUrl}/payment/status/${orderId}`,
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
        paymentType: 'DANA',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}

export class OVOGateway {
  private config: EWalletConfig

  constructor(config: EWalletConfig) {
    this.config = config
  }

  async createPayment(request: EWalletPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
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
        deepLink: response.data.deepLink,
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
        `${this.config.baseUrl}/payment/status/${orderId}`,
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
        paymentType: 'OVO',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}

export class LinkAjaGateway {
  private config: EWalletConfig

  constructor(config: EWalletConfig) {
    this.config = config
  }

  async createPayment(request: EWalletPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
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
        deepLink: response.data.deepLink,
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
        `${this.config.baseUrl}/payment/status/${orderId}`,
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
        paymentType: 'LINKAJA',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}

export class GoPayGateway {
  private config: EWalletConfig

  constructor(config: EWalletConfig) {
    this.config = config
  }

  async createPayment(request: EWalletPaymentRequest) {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payment/create`,
        {
          merchantId: this.config.merchantId,
          orderId: request.orderId,
          amount: request.amount,
          customerName: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
          customerEmail: request.customerDetails.email,
          customerPhone: request.customerDetails.phone,
          items: request.itemDetails,
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
        deepLink: response.data.deepLink,
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
        `${this.config.baseUrl}/payment/status/${orderId}`,
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
        paymentType: 'GOPAY',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }
}
