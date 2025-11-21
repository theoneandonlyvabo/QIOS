import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!storeId) return NextResponse.json({ error: 'Store ID required' }, { status: 400 })

    const where: any = { storeId }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: { customer: { select: { name: true, phone: true } }, items: { include: { product: { select: { name: true, sku: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { storeId, userId, customerId, items, paymentMethod, notes } = body

    if (!storeId || !userId || !customerId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let subtotal = 0
    const orderItemsData: any[] = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      if (product.stockQuantity < item.quantity) return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })

      const itemSubtotal = product.price * item.quantity
      subtotal += itemSubtotal

      orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price, subtotal: itemSubtotal })
    }

    const tax = subtotal * 0.11
    const total = subtotal + tax
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`

  const created = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          storeId,
          userId,
          customerId,
          paymentMethod: paymentMethod || 'CASH',
          subtotal,
          tax,
          total,
          items: { create: orderItemsData }
        },
        include: { items: { include: { product: true } }, customer: true }
      })

        for (const it of newOrder.items) {
        await tx.product.update({ where: { id: it.productId }, data: { stockQuantity: { decrement: it.quantity } } } as any)
        await tx.stockMovement.create({ data: { productId: it.productId, type: 'OUT', quantity: it.quantity, notes: `Order ${orderNumber}` } })
      }

      return newOrder
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Orders POST Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
