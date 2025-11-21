export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  subtotal: number
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  createdAt?: string | Date
}

export interface Order {
  id: string
  name: string
  customerId?: string
  customer?: Customer
  location?: string
  date?: string
  status?: string
  amount?: string
  isCancelled?: boolean
  items?: OrderItem[]
  createdAt?: string | Date
}

export interface Product {
  id: string
  name: string
  sku?: string
  price: number
  stock: number
  category?: string
  createdAt?: string | Date
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: { message: string; code?: string }
  meta?: { total?: number; page?: number; limit?: number }
}
