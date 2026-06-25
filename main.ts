import dotenv from "dotenv";
import { getLatestFive } from "./agent.ts";
import { sendNoticeEmail } from "./mailer.ts";

dotenv.config();

async function main() {
    try {
        console.log("Fetching latest notices...");

        const notices = await getLatestFive();

        console.log(`Found ${notices.length} notices.`);

        if (notices.length === 0) {
            console.log("No notices found.");
            return;
        }

        await sendNoticeEmail(notices);

        console.log("Done.");
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

main();