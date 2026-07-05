import { body, param } from "express-validator";
/**
 * ===========================================
 * Create Feedback Validator
 * ===========================================
 */
export const createFeedbackValidator = [
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
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn(["Bug", "Feature", "UX", "Other"])
        .withMessage("Category must be Bug, Feature, UX or Other"),
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 10, max: 1000 })
        .withMessage("Message must be between 10 and 1000 characters"),
];
/**
 * ===========================================
 * Feedback ID Validator
 * ===========================================
 */
export const feedbackIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Feedback ID"),
];
/**
 * ===========================================
 * Resolve Feedback Validator
 * ===========================================
 */
export const resolveFeedbackValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Feedback ID"),
];
