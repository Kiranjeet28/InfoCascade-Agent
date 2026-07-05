import { Router } from "express";
import { createHiring, getAllHiring, getHiringById, deleteHiring, getHiringCount, latestHiring, } from "../controllers/hiring.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import { publicSubmissionRateLimit } from "../middleware/rateLimit.js";
import { createHiringValidator, hiringIdValidator, } from "../validators/hiring.validator.js";
const router = Router();
/**
 * ===========================================
 * Public Routes
 * ===========================================
 */
// Submit recruitment form
router.post("/", publicSubmissionRateLimit, createHiringValidator, validate, createHiring);
/**
 * ===========================================
 * Admin Routes
 * ===========================================
 */
// Get all applications
router.get("/", auth, admin, getAllHiring);
// Latest applications
router.get("/latest", auth, admin, latestHiring);
// Total applications
router.get("/count", auth, admin, getHiringCount);
// Get application by id
router.get("/:id", auth, admin, hiringIdValidator, validate, getHiringById);
// Delete application
router.delete("/:id", auth, admin, hiringIdValidator, validate, deleteHiring);
export default router;
