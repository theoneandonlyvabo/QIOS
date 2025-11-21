import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId') || process.env.DEFAULT_STORE_ID

    if (!storeId) return NextResponse.json({ error: 'Store ID required' }, { status: 400 })

    const customers = await prisma.customer.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Customers GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { storeId, name, email, phone, address, segment } = body

    if (!storeId || !name || !phone) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const customer = await prisma.customer.create({ data: { storeId, name, email, phone, address, segment } })
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Customers POST Error:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
