import { Router } from "express";

import {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    syncNotices,
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

// Get all notices
router.get("/", getAllNotices);

// Get notice by id
router.get("/:id", getNoticeById);

/**
 * ==================================================
 * Protected Admin Routes
 * ==================================================
 */

// Create notice
router.post(
    "/",
    auth,
    admin,
    createNoticeValidator,
    validate,
    createNotice
);

// Update notice
router.put(
    "/:id",
    auth,
    admin,
    updateNoticeValidator,
    validate,
    updateNotice
);

// Delete notice
router.delete(
    "/:id",
    auth,
    admin,
    deleteNotice
);

// Run notice scraper manually
router.post(
    "/sync",
    auth,
    admin,
    syncNotices
);

export default router;
