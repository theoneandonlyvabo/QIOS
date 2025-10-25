import { NextRequest, NextResponse } from 'next/server'
import { PaymentGatewayFactory, PaymentGatewayType } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      gatewayType, 
      orderId, 
      amount, 
      customerDetails, 
      itemDetails,
      paymentMethod 
    } = body

    // Validate required fields
    if (!gatewayType || !orderId || !amount || !customerDetails || !itemDetails) {
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

    // Route to appropriate payment method based on gateway type
    switch (gatewayType) {
      case 'midtrans':
        if (paymentMethod === 'bank_transfer') {
          result = await gateway.createTransaction({
            orderId,
            amount,
            customerDetails,
            itemDetails,
          })
        } else if (['gopay', 'shopeepay', 'dana', 'ovo', 'linkaja'].includes(paymentMethod)) {
          result = await gateway.createEWalletTransaction({
            orderId,
            amount,
            customerDetails,
            itemDetails,
          }, paymentMethod as any)
        }
        break

      case 'xendit':
        if (paymentMethod === 'virtual_account') {
          result = await gateway.createVirtualAccount({
            orderId,
            amount,
            customerDetails,
            itemDetails,
          }, 'BCA')
        } else if (['OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'].includes(paymentMethod)) {
          result = await gateway.createEWalletPayment({
            orderId,
            amount,
            customerDetails,
            itemDetails,
          }, paymentMethod as any)
        } else if (paymentMethod === 'qris') {
          result = await gateway.createQRISPayment({
            orderId,
            amount,
            customerDetails,
            itemDetails,
          })
        }
        break

      case 'bca':
      case 'mandiri':
        result = await gateway.createVirtualAccount({
          orderId,
          amount,
          customerDetails,
          itemDetails,
        })
        break

      case 'dana':
      case 'ovo':
      case 'linkaja':
      case 'gopay':
        result = await gateway.createPayment({
          orderId,
          amount,
          customerDetails,
          itemDetails,
        })
        break

      case 'pln':
      case 'pdam':
        result = await gateway.createPayment({
          customerId: customerDetails.phone,
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customerPhone: customerDetails.phone,
          customerEmail: customerDetails.email,
          amount,
          referenceNumber: orderId,
          description: itemDetails.map(item => item.name).join(', '),
        })
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
      paymentUrl: result.paymentUrl,
      virtualAccountNumber: result.virtualAccountNumber,
      qrCode: result.qrCode,
      deepLink: result.deepLink,
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
