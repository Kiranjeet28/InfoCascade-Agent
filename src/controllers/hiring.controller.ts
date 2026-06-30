import { Request, Response } from "express";
import HiringService from "../services/hiring.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * =====================================================
 * Submit Hiring Form
 * POST /api/hiring
 * =====================================================
 */
export const createHiring = asyncHandler(
    async (req: Request, res: Response) => {
        const application = await HiringService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            data: application,
        });
    }
);

/**
 * =====================================================
 * Get All Applications
 * GET /api/hiring
 * =====================================================
 */
export const getAllHiring = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await HiringService.getAll({
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            search: String(req.query.search || ""),
        });

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully.",
            data: result,
        });
    }
);

/**
 * =====================================================
 * Get Application By ID
 * GET /api/hiring/:id
 * =====================================================
 */
export const getHiringById = asyncHandler(
    async (req: Request, res: Response) => {
        const application = await HiringService.getById(
            String(req.params.id)
        );

        res.status(200).json({
            success: true,
            message: "Application fetched successfully.",
            data: application,
        });
    }
);

/**
 * =====================================================
 * Delete Application
 * DELETE /api/hiring/:id
 * =====================================================
 */
export const deleteHiring = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await HiringService.delete(
            String(req.params.id)
        );

        res.status(200).json(result);
    }
);

/**
 * =====================================================
 * Total Applications
 * GET /api/hiring/count
 * =====================================================
 */
export const getHiringCount = asyncHandler(
    async (_req: Request, res: Response) => {
        const total = await HiringService.count();

        res.status(200).json({
            success: true,
            data: {
                total,
            },
        });
    }
);

/**
 * =====================================================
 * Latest Applications
 * GET /api/hiring/latest
 * =====================================================
 */
export const latestHiring = asyncHandler(
    async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 5;

        const applications = await HiringService.latest(limit);

        res.status(200).json({
            success: true,
            message: "Latest applications fetched successfully.",
            data: applications,
        });
    }
);