import { body, param } from "express-validator";

export const noticeIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid notice id"),
];

export const createNoticeValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("author")
        .optional()
        .trim(),

    body("date")
        .trim()
        .notEmpty()
        .withMessage("Date is required"),

    body("url")
        .trim()
        .isURL()
        .withMessage("Valid URL is required"),

    body("htmlContent")
        .trim()
        .notEmpty()
        .withMessage("HTML content is required"),
];

export const updateNoticeValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid notice id"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("author")
        .optional()
        .trim(),

    body("date")
        .optional()
        .trim(),

    body("url")
        .optional()
        .isURL()
        .withMessage("Invalid URL"),

    body("htmlContent")
        .optional()
        .trim(),
];
