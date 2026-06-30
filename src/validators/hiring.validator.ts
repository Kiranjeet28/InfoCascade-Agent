import { body, param } from "express-validator";

/**
 * ===========================================
 * Create Hiring Application Validator
 * ===========================================
 */
export const createHiringValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Full name must be between 3 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department must be between 2 and 100 characters"),

    body("batch")
        .trim()
        .notEmpty()
        .withMessage("Batch is required")
        .isLength({ min: 2, max: 20 })
        .withMessage("Invalid batch"),

    body("urn")
        .trim()
        .notEmpty()
        .withMessage("URN is required")
        .matches(/^\d{7}$/)
        .withMessage("URN must contain exactly 7 digits"),
];

/**
 * ===========================================
 * Hiring Application ID Validator
 * ===========================================
 */
export const hiringIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Hiring Application ID"),
];