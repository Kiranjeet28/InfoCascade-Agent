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

async function main() {
    try {
        await connectDB();

        console.log("📥 Fetching latest notices...");

        const notices = await getLatestFive();

        if (notices.length === 0) {
            console.log("No notices found.");
            return;
        }

        const newNotices: ProcessedNotice[] = [];

        for (const notice of notices) {
            // Check if already stored
            const exists = await Notification.findOne({
                url: notice.url,
            });

            if (exists) {
                console.log(`⏭ Already exists: ${ notice.title } `);
                continue;
            }

            console.log(`✨ Generating AI content for: ${ notice.title } `);

            // Generate HTML using Gemini
            const htmlContent = await generateNoticePost({
                ...notice,
                content: notice.title,
            });

            // Save to MongoDB
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
                htmlContent : htmlContent
            });

            console.log(`✅ Stored: ${ notice.title } `);
        }

        if (newNotices.length === 0) {
            console.log("No new notices found.");
            return;
        }

        console.log(`📧 Sending ${ newNotices.length } new notices...`);

        await sendNoticeEmail(newNotices);

        console.log("✅ Workflow completed successfully.");
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

main();