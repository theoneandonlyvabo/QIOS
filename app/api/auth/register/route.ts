import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import pool from '@/models/database'

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json()

        // Validasi input
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Semua field harus diisi' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Simpan user ke database
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        )

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 })

    } catch (error: any) {
        // Handle duplicate username/email
        if (error.code === '23505') { // PostgreSQL unique violation
            return NextResponse.json(
                { success: false, error: 'Username atau email sudah digunakan' },
                { status: 400 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Gagal mendaftarkan user' },
            { status: 500 }
        )
    }
}