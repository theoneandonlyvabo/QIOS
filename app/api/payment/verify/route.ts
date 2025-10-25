import { NextRequest, NextResponse } from 'next/server'
import { PaymentGatewayFactory, PaymentGatewayType } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gatewayType, orderId, paymentId } = body

    // Validate required fields
    if (!gatewayType || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
    const gateway = factory.getGateway(gatewayType as PaymentGatewayType)

    let result

    // Route to appropriate verification method based on gateway type
    switch (gatewayType) {
      case 'midtrans':
        result = await gateway.verifyPayment(orderId)
        break

      case 'xendit':
        result = await gateway.verifyPayment(paymentId || orderId)
        break

      case 'bca':
      case 'mandiri':
        result = await gateway.verifyPayment(orderId)
        break

      case 'dana':
      case 'ovo':
      case 'linkaja':
      case 'gopay':
        result = await gateway.verifyPayment(orderId)
        break

      case 'pln':
      case 'pdam':
        result = await gateway.verifyPayment(orderId)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported gateway type' },
          { status: 400 }
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      status: result.status,
      paymentType: result.paymentType,
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
