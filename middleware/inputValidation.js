/**
 * Input Validation Middleware
 * Validates route parameters and request data
 */

/**
 * Validates that an ID parameter is a positive integer
 */
const validateNumericId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        // Parse to integer
        const numericId = parseInt(id, 10);

        // Validate
        if (!Number.isInteger(numericId) || numericId <= 0) {
            return res.status(400).json({
                error: 'Invalid ID format',
                details: 'ID must be a positive integer'
            });
        }

        // Replace with validated numeric value
        req.params[paramName] = numericId;
        next();
    };
};

/**
 * Validates UUID format (if needed for future use)
 */
const validateUUID = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                error: 'Invalid UUID format'
            });
        }

        next();
    };
};

/**
 * Validates username format
 */
const validateUsernameFormat = (username) => {
    // Only allow alphanumeric and underscores, 3-50 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
};

/**
 * Validates email format (basic check)
 */
const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    validateNumericId,
    validateUUID,
    validateUsernameFormat,
    validateEmailFormat
};
