const express = require('express');
const router = express.Router();
const pool = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const { validateProduct, sanitizeInput } = require('../middleware/validation');

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new product
router.post('/', authenticateToken, validateProduct, async (req, res) => {
    try {
        const { name, description, price, stock_quantity } = req.body;
        
        const result = await pool.query(
            'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, stock_quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a product
router.put('/:id', authenticateToken, validateProduct, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity } = req.body;

        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, description, price, stock_quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a product
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;