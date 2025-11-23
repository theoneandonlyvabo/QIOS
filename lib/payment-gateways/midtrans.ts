import midtransClient from 'midtrans-client'

export interface MidtransConfig {
  serverKey: string
  clientKey: string
  isProduction: boolean
}

export interface PaymentRequest {
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

export class MidtransGateway {
  private coreApi: any

  constructor(config: MidtransConfig) {
    this.coreApi = new midtransClient.CoreApi({
      isProduction: config.isProduction,
      serverKey: config.serverKey,
      clientKey: config.clientKey,
    })
  }

  async createTransaction(request: PaymentRequest) {
    try {
      const parameter = {
        transaction_details: {
          order_id: request.orderId,
          gross_amount: request.amount,
        },
        customer_details: {
          first_name: request.customerDetails.firstName,
          last_name: request.customerDetails.lastName,
          email: request.customerDetails.email,
          phone: request.customerDetails.phone,
        },
        item_details: request.itemDetails,
        payment_type: 'bank_transfer',
        bank_transfer: {
          bank: 'bca', // Default to BCA, can be made configurable
        },
      }

      const response = await this.coreApi.charge(parameter)
      return {
        success: true,
        data: response,
        paymentUrl: response.redirect_url,
        token: response.token,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async createEWalletTransaction(request: PaymentRequest, ewalletType: 'gopay' | 'shopeepay' | 'dana' | 'ovo' | 'linkaja') {
    try {
      const parameter = {
        transaction_details: {
          order_id: request.orderId,
          gross_amount: request.amount,
        },
        customer_details: {
          first_name: request.customerDetails.firstName,
          last_name: request.customerDetails.lastName,
          email: request.customerDetails.email,
          phone: request.customerDetails.phone,
        },
        item_details: request.itemDetails,
        payment_type: ewalletType,
        [ewalletType]: {
          callback_url: process.env.NEXT_PUBLIC_APP_URL + '/payment/callback',
        },
      }

      const response = await this.coreApi.charge(parameter)
      return {
        success: true,
        data: response,
        paymentUrl: response.actions?.find((action: any) => action.name === 'deeplink_redirect')?.url,
        token: response.token,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async verifyPayment(orderId: string) {
    try {
      const response = await this.coreApi.transaction.status(orderId)
      return {
        success: true,
        data: response,
        status: response.transaction_status,
        paymentType: response.payment_type,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
