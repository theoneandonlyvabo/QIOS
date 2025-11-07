import { NextResponse } from 'next/server';
import pool from '@/models/database';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}