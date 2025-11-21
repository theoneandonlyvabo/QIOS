// @ts-nocheck
import { Xendit } from 'xendit-node'

export interface XenditConfig {
  secretKey: string
  publicKey: string
}

export interface XenditPaymentRequest {
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

export class XenditGateway {
  private xenditClient: Xendit

  constructor(config: XenditConfig) {
    this.xenditClient = new Xendit({
      secretKey: config.secretKey,
      publicKey: config.publicKey,
    })
  }

  async createVirtualAccount(request: XenditPaymentRequest, bankCode: 'BCA' | 'BNI' | 'BRI' | 'MANDIRI') {
    try {
      const virtualAccount = await this.xenditClient.VirtualAccount.create({
        externalId: request.orderId,
        bankCode: bankCode,
        name: `${request.customerDetails.firstName} ${request.customerDetails.lastName}`,
        virtualAccountNumber: '', // Xendit will generate this
        suggestedAmount: request.amount,
        isClosed: true,
        expectedAmount: request.amount,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isSingleUse: true,
      })

      return {
        success: true,
        data: virtualAccount,
        virtualAccountNumber: virtualAccount.account_number,
        paymentUrl: virtualAccount.payment_url,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async createEWalletPayment(request: XenditPaymentRequest, ewalletType: 'OVO' | 'DANA' | 'LINKAJA' | 'SHOPEEPAY') {
    try {
      const ewallet = await this.xenditClient.EWallet.createEWalletCharge({
        referenceId: request.orderId,
        currency: 'IDR',
        amount: request.amount,
        checkoutMethod: 'ONE_TIME_PAYMENT',
        channelCode: ewalletType,
        channelProperties: {
          mobileNumber: request.customerDetails.phone,
          successRedirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
          failureRedirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/failure',
        },
        customer: {
          givenNames: request.customerDetails.firstName,
          surname: request.customerDetails.lastName,
          email: request.customerDetails.email,
          mobileNumber: request.customerDetails.phone,
        },
        basket: request.itemDetails.map(item => ({
          referenceId: item.id,
          name: item.name,
          category: 'General',
          currency: 'IDR',
          quantity: item.quantity,
          price: item.price,
        })),
      })

      return {
        success: true,
        data: ewallet,
        paymentUrl: ewallet.actions?.mobile_web_checkout_url,
        deepLink: ewallet.actions?.mobile_deeplink_checkout_url,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async createQRISPayment(request: XenditPaymentRequest) {
    try {
      const qris = await this.xenditClient.QRCode.create({
        referenceId: request.orderId,
        type: 'DYNAMIC',
        currency: 'IDR',
        amount: request.amount,
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/callback',
        redirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/success',
      })

      return {
        success: true,
        data: qris,
        qrCode: qris.qr_string,
        paymentUrl: qris.qr_string,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async verifyPayment(paymentId: string) {
    try {
      const payment = await this.xenditClient.Payment.getPaymentById({
        paymentId: paymentId,
      })

      return {
        success: true,
        data: payment,
        status: payment.status,
        paymentType: payment.payment_method,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
