import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID
        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')

        if (!storeId) {
            return NextResponse.json(
                { success: false, error: 'Store ID required' },
                { status: 400 }
            )
        }

        // Determine date range
        let startDate: Date
        let endDate: Date

        if (startDateParam && endDateParam) {
            startDate = new Date(startDateParam)
            endDate = new Date(endDateParam)
            // Adjust endDate to end of day
            endDate.setHours(23, 59, 59, 999)
        } else {
            // Default to last 30 days if no date provided
            const now = new Date()
            endDate = new Date(now)
            endDate.setHours(23, 59, 59, 999)

            startDate = new Date(now)
            startDate.setDate(startDate.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)
        }

        // Fetch sales data
        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: 'COMPLETED',
                transactionDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                items: true
            },
            orderBy: {
                transactionDate: 'asc'
            }
        })

        // Aggregate sales by date
        const salesByDate = orders.reduce((acc: any, order) => {
            const date = order.transactionDate.toISOString().split('T')[0]
            if (!acc[date]) {
                acc[date] = {
                    date,
                    amount: 0,
                    items: 0,
                    customerCount: new Set()
                }
            }
            acc[date].amount += order.total
            acc[date].items += order.items.length
            acc[date].customerCount.add(order.customerId)
            return acc
        }, {})

        const sales = Object.values(salesByDate).map((day: any) => ({
            date: day.date,
            amount: day.amount,
            items: day.items,
            customerCount: day.customerCount.size
        }))

        // Fetch inventory data (Current state - not date dependent)
        const inventory = await prisma.product.findMany({
            where: { storeId },
            select: {
                id: true,
                name: true,
                stockQuantity: true,
                price: true,
                category: true
            }
        })

        const inventoryData = inventory.map(p => ({
            productId: p.id,
            name: p.name,
            stock: p.stockQuantity,
            price: p.price,
            category: p.category
        }))

        // Fetch expenses
        const expenses = await prisma.expense.findMany({
            where: {
                storeId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                date: 'asc'
            }
        })

        const expensesData = expenses.map(e => ({
            date: e.date.toISOString().split('T')[0],
            amount: e.amount,
            category: e.category,
            description: e.description
        }))

        // Fetch customers (Cumulative stats, but maybe we can filter 'lastVisit' or 'totalTransactions' in range? 
        // For now, let's keep it simple and return all customers, as customer segmentation usually considers lifetime value.
        // However, to be consistent with "Growth Analysis", maybe we should fetch new customers in this period?
        // Let's stick to the existing logic for customers for now to avoid breaking changes in the frontend structure expected by AI.)
        const customers = await prisma.customer.findMany({
            where: { storeId },
            select: {
                id: true,
                name: true,
                email: true,
                totalSpent: true,
                lastVisit: true,
                totalTransactions: true
            }
        })

        const customersData = customers.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email || '',
            totalSpent: c.totalSpent,
            lastPurchase: c.lastVisit?.toISOString().split('T')[0] || '',
            frequency: c.totalTransactions
        }))

        return NextResponse.json({
            success: true,
            data: {
                sales,
                inventory: inventoryData,
                expenses: expensesData,
                customers: customersData,
                period: {
                    start: startDate.toISOString().split('T')[0],
                    end: endDate.toISOString().split('T')[0]
                }
            }
        })

    } catch (error) {
        console.error('Business data fetch error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
