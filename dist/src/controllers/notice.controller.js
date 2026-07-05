import NoticeService from "../services/notice.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { runNoticeJob } from "../jobs/notice.job.js";
/**
 * =====================================================
 * GET /api/notices
 * =====================================================
 */
export const getAllNotices = asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string"
        ? req.query.search
        : "";
    const sort = req.query.sort === "oldest"
        ? "oldest"
        : "latest";
    const result = await NoticeService.getAll({
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search,
        sort,
    });
    res.status(200).json({
        success: true,
        message: "Notices fetched successfully.",
        data: result,
    });
});
/**
 * =====================================================
 * GET /api/notices/:id
 * =====================================================
 */
export const getNoticeById = asyncHandler(async (req, res) => {
    const notice = await NoticeService.getById(String(req.params.id));
    res.status(200).json({
        success: true,
        message: "Notice fetched successfully.",
        data: notice,
    });
});
/**
 * =====================================================
 * POST /api/notices
 * =====================================================
 */
export const createNotice = asyncHandler(async (req, res) => {
    const notice = await NoticeService.create(req.body);
    res.status(201).json({
        success: true,
        message: "Notice created successfully.",
        data: notice,
    });
});
/**
 * =====================================================
 * PUT /api/notices/:id
 * =====================================================
 */
export const updateNotice = asyncHandler(async (req, res) => {
    const notice = await NoticeService.update(String(req.params.id), req.body);
    res.status(200).json({
        success: true,
        message: "Notice updated successfully.",
        data: notice,
    });
});
/**
 * =====================================================
 * DELETE /api/notices/:id
 * =====================================================
 */
export const deleteNotice = asyncHandler(async (req, res) => {
    const result = await NoticeService.delete(String(req.params.id));
    res.status(200).json(result);
});
/**
 * =====================================================
 * GET /api/notices/latest
 * =====================================================
 */
export const latestNotices = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const notices = await NoticeService.latest(limit);
    const formatted = notices.map((n) => ({
        ...n.toObject(),
        display: `${n.title} (${n._id})`,
    }));
    res.status(200).json({
        success: true,
        message: "Latest notices fetched successfully.",
        data: formatted,
    });
});
/**
 * =====================================================
 * GET /api/notices/count
 * =====================================================
 */
export const noticeCount = asyncHandler(async (_req, res) => {
    const total = await NoticeService.count();
    res.status(200).json({
        success: true,
        data: {
            total,
        },
    });
});
/**
 * =====================================================
 * POST /api/notices/sync
 * Runs the complete AI Notice Agent
 * =====================================================
 */
export const syncNotices = asyncHandler(async (_req, res) => {
    console.log("🚀 Starting Notice Sync...");
    const result = await runNoticeJob();
    console.log("✅ Notice Sync Completed");
    res.status(200).json({
        success: true,
        message: "Notice synchronization completed successfully.",
        data: result,
    });
});
