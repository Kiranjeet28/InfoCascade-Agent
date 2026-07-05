import UserService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
 * =====================================================
 * GET /api/users
 * =====================================================
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAll({
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        search: String(req.query.search || ""),
        role: req.query.role === "admin" ||
            req.query.role === "student"
            ? req.query.role
            : undefined,
    });
    res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: users,
    });
});
/**
 * =====================================================
 * GET /api/users/:id
 * =====================================================
 */
export const getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getById(String(req.params.id));
    res.status(200).json({
        success: true,
        message: "User fetched successfully.",
        data: user,
    });
});
/**
 * =====================================================
 * POST /api/users
 * =====================================================
 */
export const createUser = asyncHandler(async (req, res) => {
    const user = await UserService.create(req.body);
    res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: user,
    });
});
/**
 * =====================================================
 * PUT /api/users/:id
 * =====================================================
 */
export const updateUser = asyncHandler(async (req, res) => {
    const user = await UserService.update(String(req.params.id), req.body);
    res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: user,
    });
});
/**
 * =====================================================
 * PATCH /api/users/:id/role
 * =====================================================
 */
export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await UserService.updateRole(String(req.params.id), req.body.role);
    res.status(200).json({
        success: true,
        message: "User role updated successfully.",
        data: user,
    });
});
/**
 * =====================================================
 * DELETE /api/users/:id
 * =====================================================
 */
export const deleteUser = asyncHandler(async (req, res) => {
    const result = await UserService.delete(String(req.params.id));
    res.status(200).json(result);
});
/**
 * =====================================================
 * GET /api/users/count
 * =====================================================
 */
export const getUserCount = asyncHandler(async (_req, res) => {
    const total = await UserService.count();
    res.status(200).json({
        success: true,
        data: {
            total,
        },
    });
});
/**
 * =====================================================
 * GET /api/users/admins
 * =====================================================
 */
export const getAdmins = asyncHandler(async (_req, res) => {
    const admins = await UserService.getAdmins();
    res.status(200).json({
        success: true,
        data: admins,
    });
});
/**
 * =====================================================
 * GET /api/users/students
 * =====================================================
 */
export const getStudents = asyncHandler(async (_req, res) => {
    const students = await UserService.getStudents();
    res.status(200).json({
        success: true,
        data: students,
    });
});
/**
 * =====================================================
 * GET /api/users/profile
 * =====================================================
 */
export const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
});
/**
 * =====================================================
 * PUT /api/users/profile
 * =====================================================
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const id = String(req.user?.id ??
        req.user?._id ??
        "");
    const profileData = {
        name: req.body.name,
        email: req.body.email,
        branch: req.body.branch,
        batch: req.body.batch,
        password: req.body.password,
    };
    const user = await UserService.update(id, profileData);
    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: user,
    });
});
