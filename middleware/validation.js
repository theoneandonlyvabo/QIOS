const validator = require('validator');
const { PASSWORD_POLICY } = require('../config/security');
const { validateUsernameFormat } = require('./inputValidation');

/**
 * Validates password strength according to security policy
 */
const validatePasswordStrength = (password) => {
    if (password.length < PASSWORD_POLICY.minLength) {
        return `Password must be at least ${PASSWORD_POLICY.minLength} characters long`;
    }

    if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }

    if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }

    if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }

    if (PASSWORD_POLICY.requireSpecialChars) {
        const specialCharsRegex = new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
        if (!specialCharsRegex.test(password)) {
            return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[];/\\`~)';
        }
    }

    return null; // Password is valid
};

const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate username format (alphanumeric and underscore only)
    if (!validateUsernameFormat(username)) {
        return res.status(400).json({
            error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores'
        });
    }

    // Validate password strength
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
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