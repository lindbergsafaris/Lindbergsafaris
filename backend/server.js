const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const uploadRoutes = require('./routes/upload');
const contentRoutes = require('./routes/content');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
// Parse allowed origins from environment variable (comma-separated)
const allowedOrigins = [
    'http://localhost:5173',
    'https://tour-and-safari-website-aizm.vercel.app',
    'https://tour-and-safari-website.vercel.app'
];

if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    allowedOrigins.push(...envOrigins);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Lindberg Safaris API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Lindberg Safaris API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            upload: '/api/upload',
            tours: '/api/content/tours',
            destinations: '/api/content/destinations',
            blog: '/api/content/blog',
            services: '/api/content/services',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`✅ Sanity Project: ${process.env.SANITY_PROJECT_ID}`);
    console.log(`☁️  Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`🌐 Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
