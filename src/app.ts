import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFound } from "./middleware/notFound.js";
import { errorMiddleware } from "./middleware/error.js";
import { env } from "./config/env.js";

const app = express();
app.use(notFound);

app.use(errorMiddleware);
app.use(
    cors({
        origin: [
            env.WEB_ORIGIN,
            "http://localhost:8080",
            "http://localhost:5173",
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

app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "InfoCascade Backend Running 🚀",
    });
});
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "InfoCascade Backend Running 🚀",
    });
});

app.use(notFound);

app.use(errorMiddleware);

export default app;