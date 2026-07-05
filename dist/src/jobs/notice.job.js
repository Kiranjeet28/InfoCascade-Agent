import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { getLatestFive } from "../services/agent/agent.service.js";
import { Notification } from "../models/Notice.js";
import { generateNoticePost } from "../services/agent/gemini.service.js";
import { sanitizeNoticeHtml } from "../utils/sanitizeHtml.js";
dotenv.config();
/**
 * =====================================================
 * Notice Sync Job
 * =====================================================
 */
export async function runNoticeJob() {
    try {
        // Connect only if not already connected
        if (mongoose.connection.readyState === 0) {
            console.log("🔌 Connecting to MongoDB...");
            await connectDB();
        }
        console.log("📥 Fetching latest notices...");
        const notices = await getLatestFive();
        if (notices.length === 0) {
            console.log("⚠ No notices found.");
            return {
                success: true,
                message: "No notices found.",
                inserted: 0,
                notices: [],
            };
        }
        const newNotices = [];
        for (const notice of notices) {
            console.log(`🔍 Checking: ${notice.title}`);
            const exists = await Notification.findOne({
                url: notice.url,
            });
            if (exists) {
                console.log(`⏭ Already Exists: ${notice.title}`);
                continue;
            }
            console.log(`🤖 Generating AI Content...`);
            const htmlContent = await generateNoticePost({
                ...notice,
                content: notice.title,
            });
            const safeHtmlContent = sanitizeNoticeHtml(htmlContent);
            console.log(`💾 Saving Notice...`);
            await Notification.create({
                title: notice.title,
                author: notice.author,
                date: notice.date,
                url: notice.url,
                htmlContent: safeHtmlContent,
            });
            newNotices.push({
                title: notice.title,
                author: notice.author,
                date: notice.date,
                url: notice.url,
                htmlContent: safeHtmlContent,
            });
            console.log(`✅ Saved: ${notice.title}`);
        }
        console.log("🎉 Notice Sync Completed.");
        return {
            success: true,
            message: `${newNotices.length} new notice(s) synchronized.`,
            inserted: newNotices.length,
            notices: newNotices,
        };
    }
    catch (error) {
        console.error("❌ Notice Sync Failed");
        console.error(error);
        throw error;
    }
}
/**
 * =====================================================
 * Run From Terminal
 * =====================================================
 */
const isDirectRun = process.argv[1]?.includes("notice.job");
if (isDirectRun) {
    runNoticeJob()
        .then(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(0);
    })
        .catch(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    });
}
