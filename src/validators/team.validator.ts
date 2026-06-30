import { body, param } from "express-validator";

/**
 * ===========================================
 * Create Team Member Validator
 * ===========================================
 */
export const createTeamValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required"),

    body("batch")
        .trim()
        .notEmpty()
        .withMessage("Batch is required"),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio must not exceed 500 characters"),

    body("email")
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("linkedin")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("LinkedIn URL is invalid"),

    body("github")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("GitHub URL is invalid"),

    body("avatarUrl")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Avatar URL is invalid"),
];

/**
 * ===========================================
 * Update Team Member Validator
 * ===========================================
 */
export const updateTeamValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Team Member ID"),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("department")
        .optional()
        .trim(),

    body("role")
        .optional()
        .trim(),

    body("batch")
        .optional()
        .trim(),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio must not exceed 500 characters"),

    body("email")
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("linkedin")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("LinkedIn URL is invalid"),

    body("github")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("GitHub URL is invalid"),

    body("avatarUrl")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Avatar URL is invalid"),
];

/**
 * ===========================================
 * Team Member ID Validator
 * ===========================================
 */
export const teamIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Team Member ID"),
];