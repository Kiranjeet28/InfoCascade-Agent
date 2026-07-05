import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import hiringRoutes from "./routes/hiring.routes.js";
import teamRoutes from "./routes/team.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorMiddleware } from "./middleware/error.js";

const app = express();

/**
 * ===========================================
 * Security Middleware
 * ===========================================
 */

app.use(
    cors({
        origin: [
            env.WEB_ORIGIN,
            /\.lovable\.app$/,
            /\.lovableproject\.com$/,
            /\.vercel\.app$/,
            "http://localhost:5173",
            "http://localhost:8080",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);

app.use(helmet());

app.use(compression());

app.disable("x-powered-by");

app.use(cookieParser());

app.use(morgan("dev"));

app.use(express.json({ limit: "100kb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "100kb",
    })
);

/**
 * ===========================================
 * Health Check
 * ===========================================
 */

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 InfoCascade Backend Running",
        version: "1.0.0",
    });
});

/**
 * ===========================================
 * API Routes
 * ===========================================
 */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/hiring", hiringRoutes);

app.use("/api/team", teamRoutes);

app.use("/api/feedback", feedbackRoutes);

/**
 * ===========================================
 * Route Not Found
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