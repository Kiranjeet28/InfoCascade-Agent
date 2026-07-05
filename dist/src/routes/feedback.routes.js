import { Router } from "express";
import { createFeedback, getAllFeedback, getFeedbackById, deleteFeedback, resolveFeedback, latestFeedback, unresolvedFeedback, getFeedbackCount, } from "../controllers/feedback.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import { publicSubmissionRateLimit } from "../middleware/rateLimit.js";
import { createFeedbackValidator, feedbackIdValidator, } from "../validators/feedback.validator.js";
const router = Router();
/**
 * ===========================================
 * Public Routes
 * ===========================================
 */
// Submit feedback
router.post("/", publicSubmissionRateLimit, createFeedbackValidator, validate, createFeedback);
/**
 * ===========================================
 * Admin Routes
 * ===========================================
 */
// Get all feedback
router.get("/", auth, admin, getAllFeedback);
// Latest feedback
router.get("/latest", auth, admin, latestFeedback);
// Total feedback
router.get("/count", auth, admin, getFeedbackCount);
// Unresolved feedback
router.get("/unresolved", auth, admin, unresolvedFeedback);
// Get feedback by id
router.get("/:id", auth, admin, feedbackIdValidator, validate, getFeedbackById);
// Resolve feedback
router.put("/:id/resolve", auth, admin, feedbackIdValidator, validate, resolveFeedback);
// Delete feedback
router.delete("/:id", auth, admin, feedbackIdValidator, validate, deleteFeedback);
export default router;
