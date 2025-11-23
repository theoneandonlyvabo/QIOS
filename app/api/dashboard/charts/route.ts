import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const storeId = searchParams.get('storeId')
        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')

        if (!storeId) {
            return NextResponse.json(
                { success: false, error: 'Store ID required' },
                { status: 400 }
            )
        }

        const startDate = startDateParam ? new Date(startDateParam) : new Date(new Date().getFullYear(), 0, 1)
        const endDate = endDateParam ? new Date(endDateParam) : new Date()

        // Adjust endDate to include the full day
        const adjustedEndDate = new Date(endDate)
        adjustedEndDate.setHours(23, 59, 59, 999)

        // Fetch orders for sales chart
        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: 'COMPLETED',
                transactionDate: {
                    gte: startDate,
                    lte: adjustedEndDate
                }
            },
            select: {
                transactionDate: true,
                total: true,
                customerId: true
            },
            orderBy: {
                transactionDate: 'asc'
            }
        })

        // Group by date
        const salesMap = new Map<string, number>()
        const activityMap = new Map<string, Set<string>>()

        orders.forEach(order => {
            const dateKey = order.transactionDate.toISOString().split('T')[0]

            // Sales
            const currentSales = salesMap.get(dateKey) || 0
            salesMap.set(dateKey, currentSales + order.total)

            // Activity (Unique customers per day)
            if (!activityMap.has(dateKey)) {
                activityMap.set(dateKey, new Set())
            }
            if (order.customerId) {
                activityMap.get(dateKey)?.add(order.customerId)
            }
        })

        // Format for charts
        const salesData = []
        const activityData = []

        // Fill in missing dates if range is small, or just use existing dates
        // For simplicity, we'll map the existing data. 
        // Ideally we should fill gaps, but let's start with actual data points.

        // Sort dates
        const sortedDates = Array.from(salesMap.keys()).sort()

        for (const date of sortedDates) {
            salesData.push({
                date,
                value: salesMap.get(date) || 0
            })

            activityData.push({
                date,
                value: activityMap.get(date)?.size || 0
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                sales: salesData,
                activity: activityData
            }
        })

    } catch (error) {
        console.error('Dashboard charts error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
