import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
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

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        const payload = verifyToken(token);

        const user = await User.findById(payload.id).select("+password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
