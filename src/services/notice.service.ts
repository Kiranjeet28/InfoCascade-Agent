import { Notification } from "../models/Notice.js";
import { escapeRegExp } from "../utils/escapeRegExp.js";
import { sanitizeNoticeHtml } from "../utils/sanitizeHtml.js";

export interface NoticeQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: "latest" | "oldest";
}

export interface CreateNoticeDto {
    title: string;
    author: string;
    date: string;
    url: string;
    htmlContent: string;
}

export interface UpdateNoticeDto {
    title?: string;
    author?: string;
    date?: string;
    url?: string;
    htmlContent?: string;
}

class NoticeService {
    /**
     * Get all notices with pagination, search and sorting
     */
    async getAll(query: NoticeQuery) {
        const {
            page = 1,
            pageSize = 10,
            search = "",
            sort = "latest",
        } = query;

        const filter: any = {};

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

        const sortQuery =
            sort === "oldest"
                ? { createdAt: 1 as const }
                : { createdAt: -1 as const };

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
    async getById(id: string) {
        const notice = await Notification.findById(id);

        if (!notice) {
            throw new Error("Notice not found");
        }

        return notice;
    }

    /**
     * Create notice
     */
    async create(data: CreateNoticeDto) {
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
    async update(id: string, data: UpdateNoticeDto) {
        const safeHtmlContent =
            typeof data.htmlContent === "string"
                ? sanitizeNoticeHtml(data.htmlContent)
                : data.htmlContent;

        const notice = await Notification.findByIdAndUpdate(
            id,
            {
                ...data,
                htmlContent: safeHtmlContent,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!notice) {
            throw new Error("Notice not found");
        }

        return notice;
    }

    /**
     * Delete notice
     */
    async delete(id: string) {
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
    async exists(url: string) {
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
