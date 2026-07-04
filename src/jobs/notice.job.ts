import dotenv from "dotenv";
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
 * Can be called from:
 * 1. API (/api/notices/sync)
 * 2. Terminal (pnpm agent)
 * 3. GitHub Actions
 * =====================================================
 */
export async function runNoticeJob() {
    try {
        await connectDB();

        console.log("📥 Fetching latest notices...");

        const notices = await getLatestFive();

        if (notices.length === 0) {
            console.log("No notices found.");

            return {
                success: true,
                message: "No notices found.",
                inserted: 0,
            };
        }

        const newNotices: ProcessedNotice[] = [];

        for (const notice of notices) {
            const exists = await Notification.findOne({
                url: notice.url,
            });

            if (exists) {
                console.log(`⏭ Already exists: ${notice.title}`);
                continue;
            }

            console.log(`✨ Generating AI content: ${notice.title}`);

            const htmlContent = await generateNoticePost({
                ...notice,
                content: notice.title,
            });

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

            console.log(`✅ Stored: ${notice.title}`);
        }

        if (newNotices.length > 0) {
            console.log(
                `📧 Sending ${newNotices.length} new notices...`
            );

            await sendNoticeEmail(newNotices);
        }

        console.log("✅ Notice Sync Completed.");

        return {
            success: true,
            inserted: newNotices.length,
            notices: newNotices,
        };
    } catch (error) {
        console.error("❌ Notice Sync Failed:", error);
        throw error;
    }
}

/**
 * =====================================================
 * Run directly from terminal
 * =====================================================
 */
const isDirectRun =
    process.argv[1] &&
    process.argv[1].includes("notice.job");

if (isDirectRun) {
    runNoticeJob()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}