import { Notification } from "./models/notification.js";
import type { Notice } from "./agent.js";

export async function getNewNotices(
    notices: Notice[]
): Promise<Notice[]> {
    const newNotices: Notice[] = [];

    for (const notice of notices) {
        const exists = await Notification.findOne({
            url: notice.url,
        });

        if (!exists) {
            await Notification.create(notice);
            newNotices.push(notice);
        }
    }

    return newNotices;
}