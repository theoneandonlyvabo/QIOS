import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const counts = await prisma.$transaction(async (tx) => {
      // Delete in correct order (respecting foreign keys)
      const deletedNotifications = await tx.notification.deleteMany();
      const deletedMovements = await tx.rawMaterialMovement.deleteMany();
      const deletedStockMovements = await tx.stockMovement.deleteMany();
      const deletedOrderItems = await tx.orderItem.deleteMany();
      const deletedOrders = await tx.order.deleteMany();
      const deletedCustomers = await tx.customer.deleteMany();

      return {
        notifications: deletedNotifications.count,
        movements: deletedMovements.count,
        stockMovements: deletedStockMovements.count,
        orderItems: deletedOrderItems.count,
        orders: deletedOrders.count,
        customers: deletedCustomers.count
      };
    });

    return NextResponse.json({
      success: true,
      summary: counts
    });
  } catch (error) {
    console.error('Reset failed:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}