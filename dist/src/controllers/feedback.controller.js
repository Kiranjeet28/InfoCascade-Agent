import FeedbackService from "../services/feedback.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
 * =====================================================
 * Submit Feedback
 * POST /api/feedback
 * =====================================================
 */
export const createFeedback = asyncHandler(async (req, res) => {
    const feedback = await FeedbackService.create(req.body);
    res.status(201).json({
        success: true,
        message: "Feedback submitted successfully.",
        data: feedback,
    });
});
/**
 * =====================================================
 * Get All Feedback
 * GET /api/feedback
 * =====================================================
 */
export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await FeedbackService.getAll({
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search: String(req.query.search || ""),
        category: req.query.category === "Bug" ||
            req.query.category === "Feature" ||
            req.query.category === "UX" ||
            req.query.category === "Other"
            ? req.query.category
            : undefined,
    });
    res.status(200).json({
        success: true,
        message: "Feedback fetched successfully.",
        data: feedback,
    });
});
/**
 * =====================================================
 * Get Feedback By ID
 * GET /api/feedback/:id
 * =====================================================
 */
export const getFeedbackById = asyncHandler(async (req, res) => {
    const feedback = await FeedbackService.getById(String(req.params.id));
    res.status(200).json({
        success: true,
        message: "Feedback fetched successfully.",
        data: feedback,
    });
});
/**
 * =====================================================
 * Resolve Feedback
 * PUT /api/feedback/:id/resolve
 * =====================================================
 */
export const resolveFeedback = asyncHandler(async (req, res) => {
    const feedback = await FeedbackService.resolve(String(req.params.id));
    res.status(200).json({
        success: true,
        message: "Feedback resolved successfully.",
        data: feedback,
    });
});
/**
 * =====================================================
 * Delete Feedback
 * DELETE /api/feedback/:id
 * =====================================================
 */
export const deleteFeedback = asyncHandler(async (req, res) => {
    const result = await FeedbackService.delete(String(req.params.id));
    res.status(200).json(result);
});
/**
 * =====================================================
 * Total Feedback
 * GET /api/feedback/count
 * =====================================================
 */
export const getFeedbackCount = asyncHandler(async (_req, res) => {
    const total = await FeedbackService.count();
    res.status(200).json({
        success: true,
        data: {
            total,
        },
    });
});
/**
 * =====================================================
 * Latest Feedback
 * GET /api/feedback/latest
 * =====================================================
 */
export const latestFeedback = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const feedback = await FeedbackService.latest(limit);
    res.status(200).json({
        success: true,
        data: feedback,
    });
});
/**
 * =====================================================
 * Unresolved Feedback
 * GET /api/feedback/unresolved
 * =====================================================
 */
export const unresolvedFeedback = asyncHandler(async (_req, res) => {
    const feedback = await FeedbackService.unresolved();
    res.status(200).json({
        success: true,
        data: feedback,
    });
});
