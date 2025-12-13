/**
 * Security Configuration
 * Validates and exports security-related constants
 */

require('dotenv').config();

// Validate JWT_SECRET
const validateJWTSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (process.env.NODE_ENV === 'production') {
        if (!secret) {
            throw new Error('❌ SECURITY ERROR: JWT_SECRET must be set in production environment');
        }
        if (secret.length < 32) {
            throw new Error('❌ SECURITY ERROR: JWT_SECRET must be at least 32 characters long in production');
        }
    } else {
        // Development mode
        if (!secret) {
            console.warn('⚠️  WARNING: JWT_SECRET not set. Using default development secret.');
            console.warn('⚠️  DO NOT use this in production!');
            return 'dev-secret-please-change-in-production-min32chars';
        }
        if (secret.length < 32) {
            console.warn('⚠️  WARNING: JWT_SECRET is less than 32 characters. Please use a stronger secret.');
        }
    }

    return secret;
};

// Validate and export JWT_SECRET
const JWT_SECRET = validateJWTSecret();

// CORS Configuration
const getCORSOptions = () => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:3000', 'http://localhost:3001'];

    if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
        console.warn('⚠️  WARNING: ALLOWED_ORIGINS not set in production. Using default localhost origins.');
    }

    return {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.warn(`🚫 CORS blocked request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
};

// Rate Limiter Configurations
const RATE_LIMITERS = {
    // Strict limiter for authentication endpoints
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 requests per window
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false, // Count all requests
    },

    // General API limiter
    api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per window
        message: 'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
    }
};

// Password Policy
const PASSWORD_POLICY = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*(),.?":{}|<>_-+=[];\'/\\`~'
};

module.exports = {
    JWT_SECRET,
    getCORSOptions,
    RATE_LIMITERS,
    PASSWORD_POLICY
};
