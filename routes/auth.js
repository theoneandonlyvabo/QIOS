const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../models/database');
const { validateUser, sanitizeInput } = require('../middleware/validation');
const { JWT_SECRET } = require('../config/security');
const { validateUsernameFormat } = require('../middleware/inputValidation');
const validator = require('validator');

// Register a new user
router.post('/register', validateUser, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userCheck = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        // FIX: Vulnerability #6 - Don't expose internal errors
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error in user registration:', error);
        }
        res.status(500).json({ error: 'Failed to create user account' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // FIX: Vulnerability #2 - Validate and sanitize input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Sanitize username
        const sanitizedUsername = validator.escape(username.trim());

        // Validate username format
        if (!validateUsernameFormat(sanitizedUsername)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Get user from database
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [sanitizedUsername]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // FIX: Vulnerability #3 - Use validated JWT_SECRET
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, userId: user.id, username: user.username });
    } catch (error) {
        // FIX: Vulnerability #6 - Don't expose internal errors
        if (process.env.NODE_ENV !== 'production') {
            console.error('Error in login:', error);
        }
        res.status(500).json({ error: 'Failed to process login request' });
    }
});

module.exports = router;