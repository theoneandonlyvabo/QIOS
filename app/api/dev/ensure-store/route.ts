import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    let store = await prisma.store.findUnique({ where: { id: 'default-store' } });

    if (!store) {
      store = await prisma.store.create({
        data: {
          id: 'default-store',
          name: 'Coffee Shop - Dev Testing',
          address: 'Jakarta, Indonesia',
          phone: '08123456789',
          email: 'dev@qios.test'
        }
      });
    }

    return NextResponse.json({ success: true, store, message: 'Store ready' });
  } catch (error: any) {
    console.error('Ensure store failed:', error);
    return NextResponse.json({ error: 'Failed to ensure store', details: error?.message }, { status: 500 });
  }
}
