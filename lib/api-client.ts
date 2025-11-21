export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> | undefined)
      }
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API request failed' }))
      throw new Error(err.message || 'API request failed')
    }

    return response.json()
  }

  async getDashboard(storeId: string) {
    return this.request(`/dashboard?storeId=${storeId}`)
  }

  async getProducts(storeId: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ storeId, ...(filters || {}) })
    return this.request(`/products?${params.toString()}`)
  }

  async createProduct(data: any) {
    return this.request('/products', { method: 'POST', body: JSON.stringify(data) })
  }

  async getOrders(storeId: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ storeId, ...(filters || {}) })
    return this.request(`/orders?${params.toString()}`)
  }

  async createOrder(data: any) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(data) })
  }

  async getInventory(storeId: string) {
    return this.request(`/inventory?storeId=${storeId}`)
  }

  async getCustomers(storeId: string) {
    return this.request(`/customers?storeId=${storeId}`)
  }

  async createCustomer(data: any) {
    return this.request('/customers', { method: 'POST', body: JSON.stringify(data) })
  }
}

export const apiClient = new ApiClient()
