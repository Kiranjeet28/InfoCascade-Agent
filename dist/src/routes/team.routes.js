import { Router } from "express";
import { createTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember, latestTeamMembers, getTeamCount, } from "../controllers/team.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";
import { adminMutationRateLimit } from "../middleware/rateLimit.js";
import { createTeamValidator, updateTeamValidator, teamIdValidator, } from "../validators/team.validator.js";
const router = Router();
/**
 * ===========================================
 * Public Routes
 * ===========================================
 */
// Get all team members
router.get("/", getAllTeamMembers);
// Get latest team members
router.get("/latest", latestTeamMembers);
// Get team member by id
router.get("/:id", teamIdValidator, validate, getTeamMemberById);
/**
 * ===========================================
 * Admin Routes
 * ===========================================
 */
// Total team members
router.get("/count", auth, admin, getTeamCount);
// Create team member
router.post("/", auth, admin, adminMutationRateLimit, createTeamValidator, validate, createTeamMember);
// Update team member
router.put("/:id", auth, admin, adminMutationRateLimit, updateTeamValidator, validate, updateTeamMember);
// Delete team member
router.delete("/:id", auth, admin, adminMutationRateLimit, teamIdValidator, validate, deleteTeamMember);
export default router;
