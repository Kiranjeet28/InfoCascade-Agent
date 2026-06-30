import { body, param } from "express-validator";

export const userIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid user id"),
];

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
        .optional()
        .trim(),

    body("batch")
        .optional()
        .trim(),

    body("role")
        .optional()
        .isIn(["student", "admin"])
        .withMessage("Role must be either student or admin"),
];

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

    body("batch")
        .optional()
        .trim(),

    body("role")
        .optional()
        .isIn(["student", "admin"])
        .withMessage("Role must be either student or admin"),
];