import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { getLatestFive } from "../services/agent/agent.service.js";
import { sendNoticeEmail } from "../services/mail.service.js";
import { Notification } from "../models/Notice.js";
import { generateNoticePost } from "../services/agent/gemini.service.js";

dotenv.config();

interface ProcessedNotice {
    title: string;
    author: string;
    date: string;
    url: string;
    htmlContent: string;
}

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

        const newNotices: ProcessedNotice[] = [];

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

            console.log(`💾 Saving Notice...`);

            await Notification.create({
                title: notice.title,
                author: notice.author,
                date: notice.date,
                url: notice.url,
                htmlContent,
            });

            newNotices.push({
                title: notice.title,
                author: notice.author,
                date: notice.date,
                url: notice.url,
                htmlContent,
            });

            console.log(`✅ Saved: ${notice.title}`);
        }

        if (newNotices.length > 0) {
            console.log(
                `📧 Sending ${newNotices.length} Email Notifications...`
            );

            await sendNoticeEmail(newNotices);
        }

        console.log("🎉 Notice Sync Completed.");

        return {
            success: true,
            message: `${newNotices.length} new notice(s) synchronized.`,
            inserted: newNotices.length,
            notices: newNotices,
        };
    } catch (error) {
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

const isDirectRun =
    process.argv[1]?.includes("notice.job");

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