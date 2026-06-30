import { body } from "express-validator";

/**
 * =====================================================
 * Register Validator
 * =====================================================
 */
export const registerValidator = [
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
        .withMessage("Password must be at least 8 characters"),

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
];

/**
 * =====================================================
 * Login Validator
 * =====================================================
 */
export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

/**
 * =====================================================
 * Change Password Validator
 * =====================================================
 */
export const changePasswordValidator = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
        .custom((value, { req }) => {
            if (value === req.body.oldPassword) {
                throw new Error(
                    "New password must be different from old password"
                );
            }

            return true;
        }),
];