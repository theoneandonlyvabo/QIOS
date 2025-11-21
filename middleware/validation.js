const validator = require('validator');

const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (username.length < 3 || username.length > 50) {
        return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
    }

    next();
};

const validateProduct = (req, res, next) => {
    const { name, price, stock_quantity } = req.body;

    if (!name || !price || stock_quantity === undefined) {
        return res.status(400).json({ error: 'Name, price, and stock quantity are required' });
    }

    if (name.length < 1 || name.length > 100) {
        return res.status(400).json({ error: 'Product name must be between 1 and 100 characters' });
    }

    if (!Number.isFinite(parseFloat(price)) || price < 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }

    if (!Number.isInteger(stock_quantity) || stock_quantity < 0) {
        return res.status(400).json({ error: 'Stock quantity must be a positive integer' });
    }

    next();
};

const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return validator.escape(input.trim());
    }
    return input;
};

module.exports = {
    validateUser,
    validateProduct,
    sanitizeInput
};