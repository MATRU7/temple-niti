import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'node:url';

import connectToDB from "./utils/db.js";
import userRouter from './routes/user.route.js';
import templeRouter from './routes/temple.route.js';
import nittiRouter from './routes/nitti.route.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Security Headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be served cross-origin
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── HTTP Request Logging ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));  // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── NoSQL Injection Prevention ────────────────────────────────────────────────
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized key: ${key} in ${req.path}`);
    }
}));

// ── Static file serving ───────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Global Rate Limit ─────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Temple Niti API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/users", userRouter);
app.use("/temples", templeRouter);
app.use("/nitti", nittiRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server (Local only) ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log(`\n🛕  Temple Niti API started`);
        console.log(`📡  Port      : ${PORT}`);
        console.log(`🌐  Frontend  : ${FRONTEND_URL}`);
        console.log(`🔧  Mode      : ${process.env.NODE_ENV || 'development'}\n`);
        connectToDB();
    });

    // ── Graceful Shutdown ─────────────────────────────────────────────────────────
    function gracefulShutdown(signal) {
        console.log(`\n🛑  Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
            console.log('✅  HTTP server closed.');
            process.exit(0);
        });
        setTimeout(() => {
            console.error('⚠️  Forced shutdown after timeout.');
            process.exit(1);
        }, 10000);
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
} else {
    // In production (Vercel), we connect to the database on every cold start
    connectToDB();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔴 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('🔴 Uncaught Exception:', err);
    process.exit(1);
});

// Export the app for Vercel Serverless Functions
export default app;