import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, updateUserRole, deleteUser, getAdmins, getStudents, getUserCount, getProfile, updateProfile, } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import { adminMutationRateLimit } from "../middleware/rateLimit.js";
import { createUserValidator, updateUserValidator, updateProfileValidator, } from "../validators/user.validator.js";
const router = Router();
/**
 * ===========================================
 * Logged In User
 * ===========================================
 */
// Get own profile
router.get("/profile", auth, getProfile);
// Update own profile
router.put("/profile", auth, updateProfileValidator, validate, updateProfile);
/**
 * ===========================================
 * Admin Routes
 * ===========================================
 */
// Get all users
router.get("/", auth, admin, getAllUsers);
// Total users
router.get("/count", auth, admin, getUserCount);
// Get all admins
router.get("/admins", auth, admin, getAdmins);
// Get all students
router.get("/students", auth, admin, getStudents);
// Get user by id
router.get("/:id", auth, admin, getUserById);
// Create user
router.post("/", auth, admin, adminMutationRateLimit, createUserValidator, validate, createUser);
// Update user
router.put("/:id", auth, admin, adminMutationRateLimit, updateUserValidator, validate, updateUser);
// Delete user
router.delete("/:id", auth, admin, adminMutationRateLimit, deleteUser);
router.patch("/:id/role", auth, admin, adminMutationRateLimit, updateUserRole);
export default router;
