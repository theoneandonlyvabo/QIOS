import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const { orderId } = await request.json();

    // Transaction to revert stock and cancel order
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  recipes: {
                    include: {
                      rawMaterial: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Revert raw material stock (add back what was decremented)
      for (const orderItem of order.items) {
        for (const recipe of orderItem.product.recipes) {
          const stockToAdd = recipe.quantity * orderItem.quantity;

          // Add stock back to raw material
          await tx.rawMaterial.update({
            where: { id: recipe.rawMaterialId },
            data: {
              stock: {
                increment: stockToAdd
              }
            }
          });

          // Record movement
          await tx.rawMaterialMovement.create({
            data: {
              rawMaterialId: recipe.rawMaterialId,
              type: 'ADJUSTMENT',
              quantity: stockToAdd,
              notes: `Stock returned from cancelled order ${order.orderNumber}`
            }
          });
        }
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
          updatedAt: new Date()
        }
      });

      // Create notification
      await tx.notification.create({
        data: {
          type: 'ORDER',
          title: 'Order Cancelled',
          message: `Order ${order.orderNumber} has been cancelled and stock returned`,
          severity: 'WARNING',
          storeId: order.storeId
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel order failed:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}