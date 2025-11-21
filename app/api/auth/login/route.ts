import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '@/models/database'

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username dan password harus diisi' },
                { status: 400 }
            )
        }

        // Cari user di database
        const result = await pool.query(
            'SELECT id, username, password_hash FROM users WHERE username = $1',
            [username]
        )

        const user = result.rows[0]
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Username atau password salah' },
                { status: 401 }
            )
        }

        // Verifikasi password
        const validPassword = await compare(password, user.password_hash)
        if (!validPassword) {
            return NextResponse.json(
                { success: false, error: 'Username atau password salah' },
                { status: 401 }
            )
        }

        // Generate JWT
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username
            },
            process.env.JWT_SECRET!,
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
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Gagal melakukan login' },
            { status: 500 }
        )
    }
}