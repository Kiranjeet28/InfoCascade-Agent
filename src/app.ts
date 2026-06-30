import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.js";

import noticeRoutes from "./routes/notice.routes.js";
import userRoutes from "./routes/user.routes.js";
// import authRoutes from "./routes/auth.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorMiddleware } from "./middleware/error.js";

const app = express();

/**
 * ===========================================
 * Middlewares
 * ===========================================
 */

app.use(
    cors({
        origin: [
            env.WEB_ORIGIN,
            "http://localhost:5173",
            "http://localhost:8080",
        ],
        credentials: true,
    })
);

app.use(helmet());

app.use(compression());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 * ===========================================
 * Health Check
 * ===========================================
 */

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 InfoCascade Backend Running",
    });
});

/**
 * ===========================================
 * API Routes
 * ===========================================
 */

// Public Notice APIs
app.use("/api/notices", noticeRoutes);

// User APIs
app.use("/api/users", userRoutes);

// Authentication APIs
// app.use("/api/auth", authRoutes);

/**
 * ===========================================
 * 404 Handler
 * ===========================================
 */

app.use(notFound);

/**
 * ===========================================
 * Global Error Handler
 * ===========================================
 */

app.use(errorMiddleware);

export default app;
