import TeamService from "../services/team.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
 * =====================================================
 * Create Team Member
 * POST /api/team
 * =====================================================
 */
export const createTeamMember = asyncHandler(async (req, res) => {
    const member = await TeamService.create(req.body);
    res.status(201).json({
        success: true,
        message: "Team member created successfully.",
        data: member,
    });
});
/**
 * =====================================================
 * Get All Team Members
 * GET /api/team
 * =====================================================
 */
export const getAllTeamMembers = asyncHandler(async (req, res) => {
    const result = await TeamService.getAll({
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search: String(req.query.search || ""),
        department: req.query.department
            ? String(req.query.department)
            : undefined,
        role: req.query.role
            ? String(req.query.role)
            : undefined,
    });
    res.status(200).json({
        success: true,
        message: "Team members fetched successfully.",
        data: result,
    });
});
/**
 * =====================================================
 * Get Team Member By ID
 * GET /api/team/:id
 * =====================================================
 */
export const getTeamMemberById = asyncHandler(async (req, res) => {
    const member = await TeamService.getById(String(req.params.id));
    res.status(200).json({
        success: true,
        message: "Team member fetched successfully.",
        data: member,
    });
});
/**
 * =====================================================
 * Update Team Member
 * PUT /api/team/:id
 * =====================================================
 */
export const updateTeamMember = asyncHandler(async (req, res) => {
    const member = await TeamService.update(String(req.params.id), req.body);
    res.status(200).json({
        success: true,
        message: "Team member updated successfully.",
        data: member,
    });
});
/**
 * =====================================================
 * Delete Team Member
 * DELETE /api/team/:id
 * =====================================================
 */
export const deleteTeamMember = asyncHandler(async (req, res) => {
    const result = await TeamService.delete(String(req.params.id));
    res.status(200).json(result);
});
/**
 * =====================================================
 * Get Team Count
 * GET /api/team/count
 * =====================================================
 */
export const getTeamCount = asyncHandler(async (_req, res) => {
    const total = await TeamService.count();
    res.status(200).json({
        success: true,
        data: {
            total,
        },
    });
});
/**
 * =====================================================
 * Latest Team Members
 * GET /api/team/latest
 * =====================================================
 */
export const latestTeamMembers = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const members = await TeamService.latest(limit);
    res.status(200).json({
        success: true,
        data: members,
    });
});
