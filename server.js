const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import security configuration (this will validate JWT_SECRET on startup)
const { getCORSOptions, RATE_LIMITERS } = require('./config/security');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers

// CORS with proper configuration (FIX: Vulnerability #1)
app.use(cors(getCORSOptions()));

app.use(express.json()); // Parse JSON bodies

// Rate limiters (FIX: Vulnerability #7)
const authLimiter = rateLimit(RATE_LIMITERS.auth);
const apiLimiter = rateLimit(RATE_LIMITERS.api);

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Apply strict rate limiting to auth endpoints
app.use('/api/auth', authLimiter, authRoutes);

// Apply general rate limiting to other API endpoints
app.use('/api/products', apiLimiter, productRoutes);

// Error handling middleware (FIX: Vulnerability #6)
app.use((err, req, res, next) => {
    // Log error for debugging (but not to console in production)
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);
    } else {
        // In production, use proper logging service
        // TODO: Implement proper logging (Winston, etc.)
        console.error('Error occurred:', err.message);
    }

    // Don't expose internal error details to users
    res.status(err.status || 500).json({
        error: 'An error occurred processing your request',
        ...(process.env.NODE_ENV !== 'production' && { details: err.message })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Server is running on port ${port}`);
    }
});
