import { Router } from "express";

import {
    register,
    login,
    logout,
    me,
    changePassword,
} from "../controllers/auth.controller.js";

import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { passwordChangeRateLimit } from "../middleware/rateLimit.js";

import {
    registerValidator,
    loginValidator,
    changePasswordValidator,
} from "../validators/auth.validator.js";

const router = Router();

/**
 * ============================================
 * Public Routes
 * ============================================
 */

/**
 * Register Student
 * POST /api/auth/register
 */
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

/**
 * Login
 * POST /api/auth/login
 */
router.post(
    "/login",
    loginValidator,
    validate,
    login
);

/**
 * ============================================
 * Protected Routes
 * ============================================
 */

/**
 * Logout
 * POST /api/auth/logout
 */
router.post(
    "/logout",
    auth,
    logout
);

/**
 * Current Logged-in User
 * GET /api/auth/me
 */
router.get(
    "/me",
    auth,
    me
);

/**
 * Change Password
 * PUT /api/auth/change-password
 */
router.put(
    "/change-password",
    auth,
    passwordChangeRateLimit,
    changePasswordValidator,
    validate,
    changePassword
);

export default router;