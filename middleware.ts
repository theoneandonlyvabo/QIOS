import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

export function middleware(req: Request) {
    // Skip authentication in development mode
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next()
    }

    try {
        // Ambil token dari header
        const headersList = headers()
        const authorization = headersList.get('authorization')

        if (!authorization?.startsWith('Bearer ')) {
            throw new Error('Invalid token format')
        }

        const token = authorization.split(' ')[1]
        if (!token) {
            throw new Error('No token provided')
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)

        // Token valid, lanjutkan ke handler
        return NextResponse.next()

    } catch (error) {
        // Token invalid atau expired
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }
}

// Tentukan route mana yang perlu autentikasi
export const config = {
    matcher: [
        '/api/products/:path*',
        '/api/orders/:path*',
        '/api/customers/:path*',
        '/api/analytics/:path*',
        '/api/payment/:path*',
        '/api/dashboard/:path*',
        '/api/notifications/:path*'
    ]
}