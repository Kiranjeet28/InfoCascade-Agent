import { Request, Response, RequestHandler } from "express";
import NoticeService from "../services/notice.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface NoticeParams {
    [key: string]: string;
    id: string;
}

interface NoticeQuery extends Record<string, any> {
    page?: string;
    pageSize?: string;
    search?: string;
    sort?: "latest" | "oldest";
    limit?: string;
}

/**
 * GET /api/notices
 * Supports ?page= &pageSize= &search= &sort=latest|oldest
 */
export const getAllNotices: RequestHandler<{}, any, any, NoticeQuery> = asyncHandler(
    async (req, res) => {
        const search = typeof req.query.search === "string" ? req.query.search : "";
        const sort: "latest" | "oldest" =
            req.query.sort === "oldest" ? "oldest" : "latest";

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
    }
);

/**
 * GET /api/notices/:id
 */
export const getNoticeById: RequestHandler<NoticeParams> = asyncHandler(
    async (req, res) => {
        const notice = NoticeService.getById(String(req.params.id))

        res.status(200).json({
            success: true,
            message: "Notice fetched successfully.",
            data: notice,
        });
    }
);

/**
 * POST /api/notices
 */
export const createNotice: RequestHandler = asyncHandler(
    async (req, res) => {
        const notice = await NoticeService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Notice created successfully.",
            data: notice,
        });
    }
);

/**
 * PUT /api/notices/:id
 */
export const updateNotice: RequestHandler<NoticeParams> = asyncHandler(
    async (req, res) => {
        const notice = await NoticeService.update(String(req.params.id), req.body);

        res.status(200).json({
            success: true,
            message: "Notice updated successfully.",
            data: notice,
        });
    }
);

/**
 * DELETE /api/notices/:id
 */
export const deleteNotice: RequestHandler<NoticeParams> = asyncHandler(
    async (req, res) => {
        const result = await NoticeService.delete(String(req.params.id));

        res.status(200).json(result);
    }
);

/**
 * GET /api/notices/latest
 */
export const latestNotices: RequestHandler<{}, any, any, NoticeQuery> = asyncHandler(
    async (req, res) => {
        const limit = Number(req.query.limit) || 5;

        const notices = await NoticeService.latest(limit);

        const formatted = notices.map((n: any) => ({
            ...n.toObject(),
            display: `${n.title} (${n._id})`,
        }));

        res.status(200).json({
            success: true,
            message: "Latest notices fetched successfully.",
            data: formatted,
        });
    }
);

/**
 * GET /api/notices/count
 */
export const noticeCount: RequestHandler = asyncHandler(
    async (req, res) => {
        const total = await NoticeService.count();

        res.status(200).json({
            success: true,
            data: {
                total,
            },
        });
    }
);

/**
 * POST /api/notices/sync
 * Runs the scraper agent → Gemini → MongoDB → email pipeline
 */
export const syncNotices: RequestHandler = asyncHandler(
    async (req, res) => {
        const result = await NoticeService.sync();

        res.status(200).json({
            success: result.success,
            message: result.message,
            data: result,
        });
    }
);