import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    if (!storeId) return NextResponse.json({ error: 'Store ID required' }, { status: 400 })

    const where: any = { storeId }
    if (category) where.category = category
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }]

    const products = await prisma.product.findMany({ where, orderBy: { name: 'asc' } })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
  const body = await req.json()
  const { storeId, sku, name, description, category, price, cost, stockQuantity, minStockLevel } = body

    if (!storeId || !sku || !name || !category || price === undefined || cost === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.product.findUnique({ where: { sku } })
    if (existing) return NextResponse.json({ error: 'SKU already exists' }, { status: 409 })

    const product = await prisma.product.create({
      data: {
        storeId,
        sku,
        name,
        description,
        category,
        price: parseFloat(price as any),
        cost: parseFloat(cost as any),
        stockQuantity: parseFloat(stockQuantity as any) || 0,
        minStockLevel: parseFloat(minStockLevel as any) || 0
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Products POST Error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
