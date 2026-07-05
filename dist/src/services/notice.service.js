import { Notification } from "../models/Notice.js";
import { escapeRegExp } from "../utils/escapeRegExp.js";
import { sanitizeNoticeHtml } from "../utils/sanitizeHtml.js";
class NoticeService {
    /**
     * Get all notices with pagination, search and sorting
     */
    async getAll(query) {
        const { page = 1, pageSize = 10, search = "", sort = "latest", } = query;
        const filter = {};
        if (search.trim()) {
            const escapedSearch = escapeRegExp(search.trim());
            filter.$or = [
                {
                    title: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
                {
                    author: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
            ];
        }
        const sortQuery = sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };
        const total = await Notification.countDocuments(filter);
        const notices = await Notification.find(filter)
            .sort(sortQuery)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return {
            items: notices,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    /**
     * Get single notice
     */
    async getById(id) {
        const notice = await Notification.findById(id);
        if (!notice) {
            throw new Error("Notice not found");
        }
        return notice;
    }
    /**
     * Create notice
     */
    async create(data) {
        const safeHtmlContent = sanitizeNoticeHtml(data.htmlContent);
        const exists = await Notification.findOne({
            url: data.url,
        });
        if (exists) {
            throw new Error("Notice already exists");
        }
        return await Notification.create({
            ...data,
            htmlContent: safeHtmlContent,
        });
    }
    /**
     * Update notice
     */
    async update(id, data) {
        const safeHtmlContent = typeof data.htmlContent === "string"
            ? sanitizeNoticeHtml(data.htmlContent)
            : data.htmlContent;
        const notice = await Notification.findByIdAndUpdate(id, {
            ...data,
            htmlContent: safeHtmlContent,
        }, {
            new: true,
            runValidators: true,
        });
        if (!notice) {
            throw new Error("Notice not found");
        }
        return notice;
    }
    /**
     * Delete notice
     */
    async delete(id) {
        const notice = await Notification.findByIdAndDelete(id);
        if (!notice) {
            throw new Error("Notice not found");
        }
        return {
            success: true,
            message: "Notice deleted successfully",
        };
    }
    /**
     * Get latest notices
     */
    async latest(limit = 5) {
        const cappedLimit = Math.min(Math.max(limit, 1), 50);
        return Notification.find()
            .sort({ createdAt: -1 })
            .limit(cappedLimit);
    }
    /**
     * Count notices
     */
    async count() {
        return Notification.countDocuments();
    }
    /**
     * Check if notice exists
     */
    async exists(url) {
        return Notification.exists({
            url,
        });
    }
    /**
     * Manual sync endpoint
     * We'll connect this with the scraper later.
     */
    async sync() {
        return {
            success: true,
            message: "Notice synchronization started.",
        };
    }
}
export default new NoticeService();
