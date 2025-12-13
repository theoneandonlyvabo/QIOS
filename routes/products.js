const express = require('express');
const router = express.Router();
const pool = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const { validateProduct, sanitizeInput } = require('../middleware/validation');
const { validateNumericId } = require('../middleware/inputValidation');

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        // FIX: Vulnerability #6 - Don't expose internal errors
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error fetching products:', error);
        }
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get a single product
// FIX: Vulnerability #5 - Validate ID parameter
router.get('/:id', validateNumericId('id'), async (req, res) => {
    try {
        const { id } = req.params; // Already validated as numeric by middleware
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error fetching product:', error);
        }
        res.status(500).json({ error: 'Failed to fetch product' });
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
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error creating product:', error);
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update a product
// FIX: Vulnerability #5 - Validate ID parameter
router.put('/:id', authenticateToken, validateNumericId('id'), validateProduct, async (req, res) => {
    try {
        const { id } = req.params; // Already validated as numeric
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
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error updating product:', error);
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product
// FIX: Vulnerability #5 - Validate ID parameter
router.delete('/:id', authenticateToken, validateNumericId('id'), async (req, res) => {
    try {
        const { id } = req.params; // Already validated as numeric

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error deleting product:', error);
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;