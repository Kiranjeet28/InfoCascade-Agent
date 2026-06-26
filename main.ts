import dotenv from "dotenv";
import { connectDB } from "./db.ts";
import { getLatestFive } from "./agent.ts";
import { sendNoticeEmail } from "./mailer.ts";
import { getNewNotices } from "./notification.service.ts";

dotenv.config();

async function main() {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log("Fetching latest notices...");

        // Scrape latest notices
        const notices = await getLatestFive();

        console.log(`Scraped ${notices.length} notices.`);

        if (notices.length === 0) {
            console.log("No notices found.");
            return;
        }

        // Get only new notices and store them in MongoDB
        const newNotices = await getNewNotices(notices);

        console.log(`Found ${newNotices.length} new notices.`);

        if (newNotices.length === 0) {
            console.log("No new notices to send.");
            return;
        }

        // Send email only for new notices
        await sendNoticeEmail(newNotices);

        console.log("✅ Email sent successfully.");
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

main();