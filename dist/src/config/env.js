import dotenv from "dotenv";
dotenv.config();
export const env = {
    PORT: process.env.PORT || "4000",
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    WEB_ORIGIN: process.env.WEB_ORIGIN || "http://localhost:8080",
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL,
};
