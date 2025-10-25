import { NextResponse } from 'next/server'
import { PaymentGatewayFactory } from '@/lib/payment-gateways'

export async function GET() {
  try {
    // Initialize payment gateway factory
    const gatewayConfig = {
      midtrans: {
        serverKey: process.env.MIDTRANS_SERVER_KEY!,
        clientKey: process.env.MIDTRANS_CLIENT_KEY!,
        isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      },
      xendit: {
        secretKey: process.env.XENDIT_SECRET_KEY!,
        publicKey: process.env.XENDIT_PUBLIC_KEY!,
      },
      bca: {
        apiKey: process.env.BCA_API_KEY!,
        baseUrl: process.env.BCA_BASE_URL || 'https://api.bca.co.id',
        merchantId: process.env.BCA_MERCHANT_ID!,
      },
      mandiri: {
        apiKey: process.env.MANDIRI_API_KEY!,
        baseUrl: process.env.MANDIRI_BASE_URL || 'https://api.mandiri.co.id',
        merchantId: process.env.MANDIRI_MERCHANT_ID!,
      },
      dana: {
        apiKey: process.env.DANA_API_KEY!,
        baseUrl: process.env.DANA_BASE_URL || 'https://api.dana.id',
        merchantId: process.env.DANA_MERCHANT_ID!,
      },
      ovo: {
        apiKey: process.env.OVO_API_KEY!,
        baseUrl: process.env.OVO_BASE_URL || 'https://api.ovo.id',
        merchantId: process.env.OVO_MERCHANT_ID!,
      },
      linkaja: {
        apiKey: process.env.LINKAJA_API_KEY!,
        baseUrl: process.env.LINKAJA_BASE_URL || 'https://api.linkaja.id',
        merchantId: process.env.LINKAJA_MERCHANT_ID!,
      },
      gopay: {
        apiKey: process.env.GOPAY_API_KEY!,
        baseUrl: process.env.GOPAY_BASE_URL || 'https://api.gopay.id',
        merchantId: process.env.GOPAY_MERCHANT_ID!,
      },
      pln: {
        apiKey: process.env.PLN_API_KEY!,
        baseUrl: process.env.PLN_BASE_URL || 'https://api.pln.co.id',
      },
      pdam: {
        apiKey: process.env.PDAM_API_KEY!,
        baseUrl: process.env.PDAM_BASE_URL || 'https://api.pdam.co.id',
      },
    }

    const factory = new PaymentGatewayFactory(gatewayConfig)
    const availableGateways = factory.getAvailableGateways()

    // Map gateway types to their display information
    const gatewayInfo = {
      midtrans: {
        name: 'Midtrans',
        description: 'Multi-payment gateway with bank transfer and e-wallet support',
        supportedMethods: ['bank_transfer', 'gopay', 'shopeepay', 'dana', 'ovo', 'linkaja'],
        logo: '/logos/midtrans.png',
      },
      xendit: {
        name: 'Xendit',
        description: 'Payment infrastructure with virtual accounts and QRIS',
        supportedMethods: ['virtual_account', 'qris', 'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'],
        logo: '/logos/xendit.png',
      },
      bca: {
        name: 'BCA',
        description: 'Bank Central Asia virtual account',
        supportedMethods: ['virtual_account'],
        logo: '/logos/bca.png',
      },
      mandiri: {
        name: 'Mandiri',
        description: 'Bank Mandiri virtual account',
        supportedMethods: ['virtual_account'],
        logo: '/logos/mandiri.png',
      },
      dana: {
        name: 'DANA',
        description: 'DANA e-wallet payment',
        supportedMethods: ['ewallet'],
        logo: '/logos/dana.png',
      },
      ovo: {
        name: 'OVO',
        description: 'OVO e-wallet payment',
        supportedMethods: ['ewallet'],
        logo: '/logos/ovo.png',
      },
      linkaja: {
        name: 'LinkAja',
        description: 'LinkAja e-wallet payment',
        supportedMethods: ['ewallet'],
        logo: '/logos/linkaja.png',
      },
      gopay: {
        name: 'GoPay',
        description: 'GoPay e-wallet payment',
        supportedMethods: ['ewallet'],
        logo: '/logos/gopay.png',
      },
      pln: {
        name: 'PLN',
        description: 'PLN electricity bill payment',
        supportedMethods: ['utility'],
        logo: '/logos/pln.png',
      },
      pdam: {
        name: 'PDAM',
        description: 'PDAM water bill payment',
        supportedMethods: ['utility'],
        logo: '/logos/pdam.png',
      },
    }

    const gateways = availableGateways.map(gateway => ({
      type: gateway,
      ...gatewayInfo[gateway as keyof typeof gatewayInfo],
    }))

    return NextResponse.json({
      success: true,
      data: gateways,
    })

  } catch (error) {
    console.error('Get gateways error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
