import { Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * =====================================================
 * Register
 * POST /api/auth/register
 * =====================================================
 */
export const register = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await AuthService.register(req.body);

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            data: result.user,
            token: result.token,
        });
    }
);

/**
 * =====================================================
 * Login
 * POST /api/auth/login
 * =====================================================
 */
export const login = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await AuthService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result.user,
            token: result.token,
        });
    }
);

/**
 * =====================================================
 * Current User
 * GET /api/auth/me
 * =====================================================
 */
export const me = asyncHandler(
    async (req: Request, res: Response) => {
        const id =
            req.user?.id ||
            req.user?._id?.toString();

        const user = await AuthService.me(id);

        res.status(200).json({
            success: true,
            data: user,
        });
    }
);

/**
 * =====================================================
 * Change Password
 * PUT /api/auth/change-password
 * =====================================================
 */
export const changePassword = asyncHandler(
    async (req: Request, res: Response) => {
        const id =
            req.user?.id ||
            req.user?._id?.toString();

        const { oldPassword, newPassword } = req.body;

        const result = await AuthService.changePassword(
            id,
            oldPassword,
            newPassword
        );

        res.status(200).json(result);
    }
);

/**
 * =====================================================
 * Logout
 * POST /api/auth/logout
 * =====================================================
 */
export const logout = asyncHandler(
    async (_req: Request, res: Response) => {
        const result = await AuthService.logout();

        res.status(200).json(result);
    }
);