import { NextResponse } from 'next/server'

// Minimal placeholder for generate-bundle dev endpoint.
// Previously the client attempted to POST to /api/dev/generate-bundle but the
// route didn't exist, causing Next to return an HTML 404 page which the
// frontend then tried to parse as JSON (Unexpected token '<').

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const scenario = (body && (body.scenario || body.type)) || 'unknown'

    // For safety, we don't implement heavy bundle generation here yet.
    // Return a helpful JSON response so the frontend can display instructions
    // instead of attempting to parse an HTML 404 page.
    return NextResponse.json(
      {
        error:
          'Bundle generation not implemented on this instance. To generate test data run the seed script or use the create-transaction dev endpoint.',
        help: {
          seed: 'npx ts-node prisma/seed-coffee-shop.ts',
          createTransactionEndpoint: '/api/dev/create-transaction (POST)'
        },
        received: { scenario }
      },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Generate-bundle failed:', error)
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 })
  }
}
