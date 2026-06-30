import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (!authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Invalid authorization header.",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(
            token,
            env.JWT_SECRET
        ) as {
            id: string;
        };

        const user = await User.findById(payload.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        req.user = user;

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};