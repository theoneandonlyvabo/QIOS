import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '@/models/database'

// Validate JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
// Only warn during module load - actual validation happens at runtime
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET not properly configured. It must be at least 32 characters.');
}

// Username validation
const validateUsernameFormat = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
};

export async function POST(req: Request) {
    try {
        // Runtime validation for JWT_SECRET
        if (!JWT_SECRET || JWT_SECRET.length < 32) {
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            )
        }

        const { username, password } = await req.json()

        // FIX: Vulnerability #2 - Validate input
        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password are required' },
                { status: 400 }
            )
        }

        // Sanitize and validate username format
        const sanitizedUsername = username.trim();
        if (!validateUsernameFormat(sanitizedUsername)) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Get user from database
        const result = await pool.query(
            'SELECT id, username, password_hash FROM users WHERE username = $1',
            [sanitizedUsername]
        )

        const user = result.rows[0]
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const validPassword = await compare(password, user.password_hash)
        if (!validPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // FIX: Vulnerability #3 - Use validated JWT_SECRET
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            }
        })

    } catch (error) {
        // FIX: Vulnerability #6 - Don't expose internal errors
        if (process.env.NODE_ENV !== 'production') {
            console.error('Login error:', error)
        }
        return NextResponse.json(
            { success: false, error: 'Failed to process login request' },
            { status: 500 }
        )
    }
}