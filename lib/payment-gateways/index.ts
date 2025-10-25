// Payment Gateway Factory
import { MidtransGateway } from './midtrans'
import { XenditGateway } from './xendit'
import { BCAGateway, MandiriGateway } from './bank-apis'
import { DANAGateway, OVOGateway, LinkAjaGateway, GoPayGateway } from './ewallet-apis'
import { PLNGateway, PDAMGateway } from './utility-apis'

export type PaymentGatewayType = 
  | 'midtrans'
  | 'xendit'
  | 'bca'
  | 'mandiri'
  | 'dana'
  | 'ovo'
  | 'linkaja'
  | 'gopay'
  | 'pln'
  | 'pdam'

export interface PaymentGatewayConfig {
  midtrans?: {
    serverKey: string
    clientKey: string
    isProduction: boolean
  }
  xendit?: {
    secretKey: string
    publicKey: string
  }
  bca?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  mandiri?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  dana?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  ovo?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  linkaja?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  gopay?: {
    apiKey: string
    baseUrl: string
    merchantId: string
  }
  pln?: {
    apiKey: string
    baseUrl: string
  }
  pdam?: {
    apiKey: string
    baseUrl: string
  }
}

export class PaymentGatewayFactory {
  private config: PaymentGatewayConfig

  constructor(config: PaymentGatewayConfig) {
    this.config = config
  }

  getGateway(type: PaymentGatewayType) {
    switch (type) {
      case 'midtrans':
        if (!this.config.midtrans) throw new Error('Midtrans config not provided')
        return new MidtransGateway(this.config.midtrans)
      
      case 'xendit':
        if (!this.config.xendit) throw new Error('Xendit config not provided')
        return new XenditGateway(this.config.xendit)
      
      case 'bca':
        if (!this.config.bca) throw new Error('BCA config not provided')
        return new BCAGateway(this.config.bca)
      
      case 'mandiri':
        if (!this.config.mandiri) throw new Error('Mandiri config not provided')
        return new MandiriGateway(this.config.mandiri)
      
      case 'dana':
        if (!this.config.dana) throw new Error('DANA config not provided')
        return new DANAGateway(this.config.dana)
      
      case 'ovo':
        if (!this.config.ovo) throw new Error('OVO config not provided')
        return new OVOGateway(this.config.ovo)
      
      case 'linkaja':
        if (!this.config.linkaja) throw new Error('LinkAja config not provided')
        return new LinkAjaGateway(this.config.linkaja)
      
      case 'gopay':
        if (!this.config.gopay) throw new Error('GoPay config not provided')
        return new GoPayGateway(this.config.gopay)
      
      case 'pln':
        if (!this.config.pln) throw new Error('PLN config not provided')
        return new PLNGateway(this.config.pln)
      
      case 'pdam':
        if (!this.config.pdam) throw new Error('PDAM config not provided')
        return new PDAMGateway(this.config.pdam)
      
      default:
        throw new Error(`Unsupported payment gateway: ${type}`)
    }
  }

  // Get all available gateways
  getAvailableGateways(): PaymentGatewayType[] {
    const available: PaymentGatewayType[] = []
    
    if (this.config.midtrans) available.push('midtrans')
    if (this.config.xendit) available.push('xendit')
    if (this.config.bca) available.push('bca')
    if (this.config.mandiri) available.push('mandiri')
    if (this.config.dana) available.push('dana')
    if (this.config.ovo) available.push('ovo')
    if (this.config.linkaja) available.push('linkaja')
    if (this.config.gopay) available.push('gopay')
    if (this.config.pln) available.push('pln')
    if (this.config.pdam) available.push('pdam')
    
    return available
  }
}

// Export all gateway classes
export {
  MidtransGateway,
  XenditGateway,
  BCAGateway,
  MandiriGateway,
  DANAGateway,
  OVOGateway,
  LinkAjaGateway,
  GoPayGateway,
  PLNGateway,
  PDAMGateway,
}
