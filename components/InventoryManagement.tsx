'use client'

import { useState, useEffect } from 'react'
import { Package, AlertTriangle, PlusCircle, RefreshCcw, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  lastRestocked: string
}

interface StockMovement {
  id: string
  productId: string
  type: 'in' | 'out'
  quantity: number
  date: string
  reason: string
}

const InventoryManagement = ({ storeId }: { storeId?: string }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch inventory from API when storeId is available
  useEffect(() => {
    if (!storeId) return

    const fetchInventory = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/inventory?storeId=${storeId}`)
        if (!res.ok) throw new Error('Failed to fetch inventory')
        const data = await res.json()
        // API returns products and counts
        setProducts((data.products || []).map((p: any) => ({
          id: String(p.id),
          name: p.name,
          category: p.category || '',
          stock: p.stockQuantity ?? p.stock ?? 0,
          minStock: p.minStockLevel ?? p.minStock ?? 0,
          price: p.price ?? p.cost ?? 0,
          lastRestocked: p.updatedAt ?? p.lastRestocked ?? ''
        })))
        // movements not provided by this endpoint; keep empty for now
        setMovements([])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching inventory')
        console.error('InventoryManagement fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [storeId])

  const getLowStockProducts = () => {
    return products.filter(product => product.stock < product.minStock)
  }

  const lowStockProducts = getLowStockProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Inventori</h2>
            <p className="text-gray-600 dark:text-gray-400">Kelola stok dan pemantauan produk</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Produk</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Stok Rendah</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockProducts.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pergerakan Hari Ini</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{movements.length}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-red-900 dark:text-red-300">Peringatan Stok Rendah</h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stok: {product.stock} / Min: {product.minStock}
                  </p>
                </div>
                <button className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center">
                  <RefreshCcw className="w-4 h-4 mr-1" />
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Daftar Produk</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map(product => (
            <div key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kategori: {product.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Stok: {product.stock}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rp {product.price.toLocaleString()}
                    </p>
                  </div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Movement History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Riwayat Pergerakan Stok</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {movements.map(movement => (
            <div key={movement.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {products.find(p => p.id === movement.productId)?.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{movement.reason}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    movement.type === 'in' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity} unit
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{movement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InventoryManagement