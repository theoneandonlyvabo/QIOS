import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Parallel queries for better performance
    const [
      revenueData,
      totalOrders,
      pendingOrders,
      activeCustomers,
      lowStockProducts,
      recentTransactions
    ] = await Promise.all([
      // Total Revenue (completed orders)
      prisma.order.aggregate({
        where: { 
          status: 'COMPLETED',
          paymentStatus: 'PAID',
        },
        _sum: { total: true }
      }),
      
      // Total Orders
      prisma.order.count(),
      
      // Pending Orders
      prisma.order.count({
        where: { 
          OR: [
            { status: 'PENDING' },
            { status: 'PROCESSING' }
          ]
        }
      }),
      
      // Active Customers (ordered in last 30 days)
      prisma.customer.count({
        where: {
          orders: {
            some: {
              transactionDate: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      }),
      
      // Low Stock Products (below minStockLevel)
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
      
      // Recent Transactions (10 latest)
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
          status: 'COMPLETED'
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
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        orderNumber: tx.orderNumber,
        customer: tx.customer.name,
        customerSegment: tx.customer.segment,
        total: tx.total,
        date: tx.transactionDate,
        status: tx.status,
        paymentStatus: tx.paymentStatus,
        items: tx.items.map(item => ({
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