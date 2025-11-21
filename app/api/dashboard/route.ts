import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 })
    }

  const [totalRevenueAgg, totalOrders, activeCustomers, lowStockCount, recentOrders, orderStatusGroups] = await Promise.all([
      prisma.order.aggregate({
        where: { storeId, status: 'COMPLETED', paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      prisma.order.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId } }),
      prisma.product.count({ where: { storeId, stockQuantity: { lte: prisma.product.fields.minStockLevel } } }),
      prisma.order.findMany({
        where: { storeId },
        include: { customer: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.order.groupBy({ by: ['status'], where: { storeId }, _count: { _all: true } })
    ])

    const revenue = totalRevenueAgg._sum.total || 0

    return NextResponse.json({
      revenue,
      orders: totalOrders,
      customers: activeCustomers,
      lowStockItems: lowStockCount,
      recentOrders: recentOrders.map((o: any) => ({ id: o.id, orderNumber: o.orderNumber, customer: o.customer?.name ?? null, total: o.total, status: o.status, createdAt: o.createdAt })),
      orderStatus: {
        pending: (orderStatusGroups.find((g: any) => g.status === 'PENDING')?._count || 0) as number,
        processing: (orderStatusGroups.find((g: any) => g.status === 'PROCESSING')?._count || 0) as number,
        completed: (orderStatusGroups.find((g: any) => g.status === 'COMPLETED')?._count || 0) as number,
        cancelled: (orderStatusGroups.find((g: any) => g.status === 'CANCELLED')?._count || 0) as number
      }
    })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
