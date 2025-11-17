const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors());   // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
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
