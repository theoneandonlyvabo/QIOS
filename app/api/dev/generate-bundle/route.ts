import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Dev-only bundle generator. This will replenish raw materials, create a set
// of customers and transactions according to a named scenario. It's intentionally
// defensive and only available in development.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const scenario = (body && (body.scenario || body.type)) || 'one_week'

    // Scenario presets (keeps in sync with client-side presets)
    const presets: Record<string, { customers: number; transactions: number }> = {
      slow_monday: { customers: 15, transactions: 20 },
      busy_friday: { customers: 50, transactions: 80 },
      weekend_rush: { customers: 100, transactions: 150 },
      one_week: { customers: 200, transactions: 400 },
      q1_2025: { customers: 500, transactions: 3000 }
    }

    const selected = presets[scenario] || presets['one_week']

    // Ensure store exists
    let store = await prisma.store.findUnique({ where: { id: 'default-store' } })
    if (!store) {
      store = await prisma.store.create({ data: { id: 'default-store', name: 'Dev Store' } })
    }

    // Replenish raw materials to initialStock to avoid insufficient-stock failures
    const rawMaterials = await prisma.rawMaterial.findMany()
    for (const rm of rawMaterials) {
      await prisma.rawMaterial.update({
        where: { id: rm.id },
        data: {
          stock: rm.initialStock,
          movements: { create: { type: 'ADJUSTMENT', quantity: rm.initialStock - rm.stock, notes: 'Reset to initial stock (bundle gen)' } }
        }
      })
    }

    // Fetch available products (with recipes). We'll only create orders for products
    // that have recipes defined so raw material decrement works.
    const products = await prisma.product.findMany({ include: { recipes: { include: { rawMaterial: true } } } })
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found in DB. Run seed script.' }, { status: 500 })
    }

    // Create customers
    const customerIds: string[] = []
    for (let i = 0; i < selected.customers; i++) {
      const customer = await prisma.customer.create({ data: { name: `Dev Customer ${Date.now()}-${i}`, phone: `081000${Math.floor(1000 + Math.random() * 8999)}`, storeId: store.id } })
      customerIds.push(customer.id)
    }

    // Helper: pick n random products with available stock
    const pickItems = (count = 1) => {
      const available = products.filter(p => p.stockQuantity > 0 && p.recipes && p.recipes.length > 0)
      const items: { productId: string; quantity: number }[] = []
      for (let i = 0; i < count; i++) {
        const p = available[Math.floor(Math.random() * available.length)]
        if (!p) break
        const qty = Math.max(1, Math.floor(Math.random() * 3))
        items.push({ productId: p.id, quantity: qty })
      }
      return items
    }

    let created = 0
    let failed = 0

    for (let t = 0; t < selected.transactions; t++) {
      const custId = customerIds[Math.floor(Math.random() * customerIds.length)]
      const items = pickItems(1 + Math.floor(Math.random() * 3))

      // perform transaction in a prisma transaction
      try {
        await prisma.$transaction(async (tx) => {
          // calculate subtotal and validate raw materials
          let subtotal = 0
          for (const it of items) {
            const product = await tx.product.findUnique({ where: { id: it.productId }, include: { recipes: { include: { rawMaterial: true } } } })
            if (!product) throw new Error('Product not found')
            for (const recipe of product.recipes) {
              const required = recipe.quantity * it.quantity
              if (recipe.rawMaterial.stock < required) throw new Error('Insufficient raw material')
            }
            subtotal += product.price * it.quantity
          }

          const tax = subtotal * 0.11
          const total = subtotal + tax
          const order = await tx.order.create({ data: { orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random()*10000)}`, customerId: custId, storeId: store.id, status: 'COMPLETED', paymentMethod: 'QRIS', paymentStatus: 'PENDING', subtotal, tax, discount: 0, total, transactionDate: new Date() } })

          for (const it of items) {
            const product = await tx.product.findUnique({ where: { id: it.productId }, include: { recipes: { include: { rawMaterial: true } } } })
            if (!product) throw new Error('Product not found during order item creation')
            await tx.orderItem.create({ data: { orderId: order.id, productId: product.id, quantity: it.quantity, price: product.price, subtotal: product.price * it.quantity } })
            await tx.product.update({ where: { id: product.id }, data: { stockQuantity: { decrement: it.quantity } } })
            const prodWithRecipes = await tx.product.findUnique({ where: { id: product.id }, include: { recipes: { include: { rawMaterial: true } } } })
            if (!prodWithRecipes) throw new Error('Product recipes not found')
            for (const recipe of prodWithRecipes.recipes) {
              const usedQty = recipe.quantity * it.quantity
              await tx.rawMaterial.update({ where: { id: recipe.rawMaterialId }, data: { stock: { decrement: usedQty } } })
              await tx.rawMaterialMovement.create({ data: { rawMaterialId: recipe.rawMaterialId, type: 'OUT', quantity: usedQty, notes: `Order ${order.orderNumber}`, orderId: order.id } })
            }
            await tx.stockMovement.create({ data: { productId: product.id, type: 'OUT', quantity: it.quantity, notes: `Order ${order.orderNumber}` } })
          }

          await tx.customer.update({ where: { id: custId }, data: { totalTransactions: { increment: 1 }, totalSpent: { increment: total }, lastVisit: new Date() } })
        })
        created++
      } catch (err) {
        console.error('Transaction creation failed (bundle gen):', err)
        failed++
      }
    }

    return NextResponse.json({ success: true, summary: { scenario, customers: selected.customers, transactionsCreated: created, transactionsFailed: failed, dateRange: 'dev-generated' } })
  } catch (error: any) {
    console.error('Generate-bundle failed:', error)
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 })
  }
}
