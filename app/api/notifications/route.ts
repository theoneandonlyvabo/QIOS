import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { status: 'error', message: 'Store ID is required' },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        storeId,
        ...(unreadOnly ? { isRead: false } : {})
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = await prisma.notification.count({
      where: {
        storeId,
        isRead: false
      }
    });

    return NextResponse.json({
      status: 'success',
      notifications,
      unreadCount
    });

  } catch (error) {
    logger.error('Notifications fetch error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch notifications',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, markAllRead, storeId } = await request.json();

    if (!storeId) {
      return NextResponse.json(
        { status: 'error', message: 'Store ID is required' },
        { status: 400 }
      );
    }

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: {
          storeId,
          isRead: false
        },
        data: { isRead: true }
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: {
          id: notificationId,
          storeId
        },
        data: { isRead: true }
      });
    } else {
      return NextResponse.json(
        { status: 'error', message: 'Either notificationId or markAllRead is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: markAllRead ? 'All notifications marked as read' : 'Notification marked as read'
    });

  } catch (error) {
    logger.error('Notification update error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update notification',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}