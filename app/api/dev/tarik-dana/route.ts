import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const { orderId } = await request.json();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        updatedAt: new Date()
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'PAYMENT',
        title: 'Payment Confirmed',
        message: `Payment for order ${order.orderNumber} has been confirmed`,
        severity: 'SUCCESS',
        storeId: order.storeId
      }
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    console.error('Tarik dana failed:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}