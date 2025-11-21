import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    const rawMaterials = await prisma.rawMaterial.findMany();

    const updates = [];
    for (const rm of rawMaterials) {
      const updated = await prisma.rawMaterial.update({
        where: { id: rm.id },
        data: {
          stock: rm.initialStock,
          movements: {
            create: {
              type: 'ADJUSTMENT',
              quantity: rm.initialStock - rm.stock,
              notes: 'Reset to initial stock'
            }
          }
        }
      });

      updates.push({
        name: rm.name,
        resetTo: `${rm.initialStock}${rm.unit}`
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        itemsReset: updates.length,
        details: updates
      }
    });
  } catch (error) {
    console.error('Generate supply failed:', error);
    return NextResponse.json({ error: 'Failed to generate supply' }, { status: 500 });
  }
}