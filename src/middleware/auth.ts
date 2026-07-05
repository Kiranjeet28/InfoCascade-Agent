import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

interface TokenPayload extends JwtPayload {
    id: string;
    tokenVersion?: number;
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as TokenPayload;

        if (!decoded?.id) {
            res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
            return;
        }

        // Always fetch the latest user from the database
        const user = await User.findById(decoded.id)
            .select("-password")
            .lean();

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User no longer exists.",
            });
            return;
        }

        if ((decoded.tokenVersion ?? -1) !== (user.tokenVersion ?? 0)) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Middleware:", error);

        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};