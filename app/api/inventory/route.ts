import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID

    if (!storeId) return NextResponse.json({ error: 'Store ID required' }, { status: 400 })

    const [products, totalProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      prisma.product.findMany({ where: { storeId }, orderBy: { name: 'asc' } }),
      prisma.product.count({ where: { storeId } }),
      prisma.product.findMany({ where: { storeId, stockQuantity: { lte: prisma.product.fields.minStockLevel, gt: 0 } } }),
      prisma.product.findMany({ where: { storeId, stockQuantity: 0 } })
    ])

  const stockValue = products.reduce((sum: number, p: any) => sum + (p.stockQuantity * (p.cost || 0)), 0)

    return NextResponse.json({
      totalProducts,
      totalStockValue: stockValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      products: products.map((p: any) => ({
        ...p,
        status: p.stockQuantity === 0 ? 'OUT_OF_STOCK' : p.stockQuantity <= p.minStockLevel ? 'LOW_STOCK' : 'IN_STOCK',
        stockValue: (p.stockQuantity * (p.cost || 0))
      })),
      lowStockProducts,
      outOfStockProducts
    })
  } catch (error) {
    console.error('Inventory GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory data' }, { status: 500 })
  }
}
