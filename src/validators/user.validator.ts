import { body, param } from "express-validator";

/**
 * =====================================================
 * User ID Validation
 * =====================================================
 */
export const userIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid user id"),
];

/**
 * =====================================================
 * Create User Validation
 * =====================================================
 */
export const createUserValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters"),

    body("branch")
        .trim()
        .notEmpty()
        .withMessage("Branch is required"),

    body("year")
        .trim()
        .notEmpty()
        .withMessage("Year is required"),

    body("urn")
        .trim()
        .notEmpty()
        .withMessage("URN is required")
        .matches(/^\d{7}$/)
        .withMessage("URN must contain exactly 7 digits"),

    body("crn")
        .trim()
        .notEmpty()
        .withMessage("CRN is required")
        .matches(/^\d{7}$/)
        .withMessage("CRN must contain exactly 7 digits"),

    body("group")
        .trim()
        .optional(),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("role")
        .optional()
        .isIn(["student", "admin"])
        .withMessage("Role must be either student or admin"),
];

/**
 * =====================================================
 * Update User Validation
 * =====================================================
 */
export const updateUserValidator = [
    param("id")
        .optional()
        .isMongoId()
        .withMessage("Invalid user id"),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters"),

    body("branch")
        .optional()
        .trim(),

    body("year")
        .optional()
        .trim(),

    body("urn")
        .optional()
        .matches(/^\d{7}$/)
        .withMessage("URN must contain exactly 7 digits"),

    body("crn")
        .optional()
        .matches(/^\d{7}$/)
        .withMessage("CRN must contain exactly 7 digits"),

    body("group")
        .optional()
        .trim(),

    body("department")
        .optional()
        .trim(),

    body("role")
        .optional()
        .isIn(["student", "admin"])
        .withMessage("Role must be either student or admin"),
];