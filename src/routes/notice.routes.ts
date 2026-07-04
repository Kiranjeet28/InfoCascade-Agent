import { Router } from "express";

import {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    syncNotices,
    latestNotices,
    noticeCount,
} from "../controllers/notice.controller.js";

import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";

import {
    createNoticeValidator,
    updateNoticeValidator,
} from "../validators/notice.validator.js";

const router = Router();

/**
 * ==================================================
 * Public Routes
 * ==================================================
 */

// GET /api/notices
router.get("/", getAllNotices);

// GET /api/notices/latest?limit=5
router.get("/latest", latestNotices);

// GET /api/notices/count
router.get("/count", noticeCount);

// GET /api/notices/:id
router.get("/:id", getNoticeById);

/**
 * ==================================================
 * Admin Routes
 * ==================================================
 */

// POST /api/notices
router.post(
    "/",
    auth,
    admin,
    createNoticeValidator,
    validate,
    createNotice
);

// PUT /api/notices/:id
router.put(
    "/:id",
    auth,
    admin,
    updateNoticeValidator,
    validate,
    updateNotice
);

// DELETE /api/notices/:id
router.delete(
    "/:id",
    auth,
    admin,
    deleteNotice
);

// POST /api/notices/sync
// Runs Scraper → Gemini → MongoDB → Email
router.post(
    "/sync",
    auth,
    admin,
    syncNotices
);

export default router;