// Dashboard Types
export interface DashboardData {
  revenue: number
  orders: number
  customers: number
  lowStockItems: number
  recentOrders: RecentOrder[]
  orderStatus: OrderStatusCounts
  revenueTrends?: RevenueTrend[]
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customer: string | null
  total: number
  status: string
  createdAt: Date
}

export interface OrderStatusCounts {
  pending: number
  processing: number
  completed: number
  cancelled: number
}

export interface RevenueTrend { date: Date; revenue: number }

// Product Types
export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  category: string
  price: number
  cost: number
  stockQuantity: number
  minStockLevel: number
  unit: string
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  stockValue?: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductInput {
  storeId: string
  sku: string
  name: string
  description?: string
  category: string
  price: number
  cost: number
  stockQuantity?: number
  minStockLevel?: number
  unit?: string
}

// Order Types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: { name: string; phone?: string }
  userId: string
  status: OrderStatus
  paymentMethod: string
  paymentStatus: PaymentStatus
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: { name: string; sku: string }
  quantity: number
  price: number
  subtotal: number
}

// Customer Types
export type CustomerSegment = 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE'

export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  segment: CustomerSegment
  createdAt: Date
  updatedAt: Date
}

export interface CreateCustomerInput {
  storeId: string
  name: string
  email?: string
  phone: string
  address?: string
  segment?: CustomerSegment
}

// Inventory Types
export interface InventoryData {
  totalProducts: number
  totalStockValue: number
  lowStockCount: number
  outOfStockCount: number
  products: Product[]
  lowStockProducts: Product[]
  outOfStockProducts: Product[]
}
