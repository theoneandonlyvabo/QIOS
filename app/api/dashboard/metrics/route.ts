import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Default to current month if no date provided
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDate = startDateParam ? new Date(startDateParam) : defaultStart;
    const endDate = endDateParam ? new Date(endDateParam) : defaultEnd;

    // Adjust endDate to include the full day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    // Date filter object
    const dateFilter = {
      gte: startDate,
      lte: adjustedEndDate
    };

    // Parallel queries for better performance
    const [
      revenueData,
      totalOrders,
      pendingOrders,
      activeCustomers,
      lowStockProducts,
      recentTransactions
    ] = await Promise.all([
      // Total Revenue (all completed orders within date range)
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          transactionDate: dateFilter
        },
        _sum: { total: true }
      }),

      // Total Orders (within date range)
      prisma.order.count({
        where: {
          transactionDate: dateFilter
        }
      }),

      // Pending Orders (current status, regardless of date, OR created within date range? 
      // Usually pending orders are "current state", but if filtering by date, maybe we want 
      // orders created in that range that are currently pending? 
      // Let's stick to "current state" for Pending as it's a status indicator, 
      // BUT the user asked for integration. 
      // If I select last month, "Pending Orders" might mean "Orders from last month that are still pending" (unlikely) 
      // or "Orders from last month that were pending at some point"?
      // Standard dashboard behavior: "Pending" usually implies "Action needed NOW". 
      // However, if the user wants to see "Performance of Oct", showing "Current Pending" might be misleading if they are from Nov.
      // Let's filter Pending orders by transactionDate as well to be consistent with the view.
      prisma.order.count({
        where: {
          OR: [
            { status: 'PENDING' },
            { status: 'PROCESSING' }
          ],
          transactionDate: dateFilter
        }
      }),

      // Active Customers (ordered within date range)
      prisma.customer.count({
        where: {
          orders: {
            some: {
              transactionDate: dateFilter
            }
          }
        }
      }),

      // Low Stock Products (Current state - NOT date dependent)
      prisma.product.findMany({
        where: {
          stockQuantity: {
            lte: prisma.product.fields.minStockLevel
          }
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stockQuantity: true,
          minStockLevel: true
        }
      }),

      // Recent Transactions (within date range)
      prisma.order.findMany({
        take: 10,
        orderBy: { transactionDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              segment: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        },
        where: {
          status: 'COMPLETED',
          transactionDate: dateFilter
        }
      })
    ]);

    // Calculate metrics
    const metrics = {
      totalRevenue: revenueData._sum.total || 0,
      totalOrders,
      pendingOrders,
      activeCustomers,
      lowStockAlert: {
        count: lowStockProducts.length,
        products: lowStockProducts
      }
    };

    // Format response
    const response = {
      status: 'success',
      metrics,
      recentTransactions: recentTransactions.map((tx: any) => ({
        id: tx.id,
        orderNumber: tx.orderNumber,
        customer: tx.customer.name,
        customerSegment: tx.customer.segment,
        total: tx.total,
        date: tx.transactionDate,
        status: tx.status,
        paymentStatus: tx.paymentStatus,
        items: tx.items.map((item: any) => ({
          product: item.product.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Dashboard metrics error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch dashboard metrics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}