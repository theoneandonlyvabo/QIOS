import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

const STORE_ID = process.env.STORE_ID ?? 'default-store';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const { customerName, customerPhone, items, paymentMethod, transactionDate } = await req.json();

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Calculate subtotal and verify availability of raw materials
    let subtotal = 0;

    for (const it of items) {
      const product = await prisma.product.findUnique({
        where: { id: it.productId },
        include: { recipes: { include: { rawMaterial: true } } }
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${it.productId} not found` }, { status: 404 });
      }

      // Check each recipe raw material for availability
      for (const recipe of product.recipes) {
        const required = recipe.quantity * it.quantity;
        if (recipe.rawMaterial.stock < required) {
          return NextResponse.json({ error: `Insufficient raw material ${recipe.rawMaterial.name} for product ${product.name}` }, { status: 400 });
        }
      }

      subtotal += product.price * it.quantity;
    }

    const tax = subtotal * 0.11;
    const total = subtotal + tax;
    const orderNumber = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

    const newOrder = await prisma.$transaction(async (tx: any) => {
      // find or create customer (by phone)
      let customer = await tx.customer.findUnique({ where: { phone: customerPhone } });
      if (!customer) {
        customer = await tx.customer.create({ data: { name: customerName, phone: customerPhone, storeId: STORE_ID, segment: 'NEW' } });
      }

      // create order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          storeId: STORE_ID,
          status: 'COMPLETED',
          paymentMethod: paymentMethod ?? 'QRIS',
          paymentStatus: 'PENDING',
          subtotal,
          tax,
          discount: 0,
          total,
          transactionDate: transactionDate ? new Date(transactionDate) : new Date()
        }
      });

      // create items and decrement raw materials & product stock
      for (const it of items) {
        const product = await tx.product.findUnique({ where: { id: it.productId }, include: { recipes: true } });
        const itemSubtotal = product.price * it.quantity;

        await tx.orderItem.create({ data: { orderId: createdOrder.id, productId: product.id, quantity: it.quantity, price: product.price, subtotal: itemSubtotal } });

        // decrement finished product stockQuantity (if using finished product stock)
        await tx.product.update({ where: { id: product.id }, data: { stockQuantity: { decrement: it.quantity } } });

        // for each recipe, decrement raw material and create movement
        const productWithRecipes = await tx.product.findUnique({ where: { id: product.id }, include: { recipes: { include: { rawMaterial: true } } } });
        for (const recipe of productWithRecipes.recipes) {
          const usedQty = recipe.quantity * it.quantity;
          await tx.rawMaterial.update({ where: { id: recipe.rawMaterialId }, data: { stock: { decrement: usedQty } } });
          await tx.rawMaterialMovement.create({ data: { rawMaterialId: recipe.rawMaterialId, type: 'OUT', quantity: usedQty, notes: `Order ${orderNumber}`, orderId: createdOrder.id } });
        }

        // product stock movement
        await tx.stockMovement.create({ data: { productId: product.id, type: 'OUT', quantity: it.quantity, notes: `Order ${orderNumber}` } });
      }

      // update customer stats
      await tx.customer.update({ where: { id: customer.id }, data: { totalTransactions: { increment: 1 }, totalSpent: { increment: total }, lastVisit: new Date() } });

      return createdOrder;
    });

    return NextResponse.json({ success: true, orderNumber: newOrder.orderNumber, orderId: newOrder.id }, { status: 201 });
  } catch (error) {
    console.error('Create transaction failed:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}