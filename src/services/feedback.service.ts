import { Feedback } from "../models/Feedback.js";

export interface FeedbackQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: "Bug" | "Feature" | "UX" | "Other";
}

export interface CreateFeedbackDto {
    name: string;
    email: string;
    rating: number;
    category: "Bug" | "Feature" | "UX" | "Other";
    message: string;
}

class FeedbackService {
    /**
     * =====================================
     * Submit Feedback
     * =====================================
     */
    async create(data: CreateFeedbackDto) {
        const feedback = await Feedback.create({
            name: data.name,
            email: data.email.toLowerCase(),
            rating: data.rating,
            category: data.category,
            message: data.message,
        });

        return feedback;
    }

    /**
     * =====================================
     * Get All Feedback
     * =====================================
     */
    async getAll(query: FeedbackQuery) {
        const {
            page = 1,
            pageSize = 10,
            search = "",
            category,
        } = query;

        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        if (search.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    message: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const total = await Feedback.countDocuments(filter);

        const feedbacks = await Feedback.find(filter)
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            items: feedbacks,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * =====================================
     * Get Feedback By ID
     * =====================================
     */
    async getById(id: string) {
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            throw new Error("Feedback not found");
        }

        return feedback;
    }

    /**
     * =====================================
     * Mark Feedback as Resolved
     * =====================================
     */
    async resolve(id: string) {
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            {
                resolved: true,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!feedback) {
            throw new Error("Feedback not found");
        }

        return feedback;
    }

    /**
     * =====================================
     * Delete Feedback
     * =====================================
     */
    async delete(id: string) {
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            throw new Error("Feedback not found");
        }

        return {
            success: true,
            message: "Feedback deleted successfully.",
        };
    }

    /**
     * =====================================
     * Total Feedback
     * =====================================
     */
    async count() {
        return Feedback.countDocuments();
    }

    /**
     * =====================================
     * Latest Feedback
     * =====================================
     */
    async latest(limit: number = 5) {
        return Feedback.find()
            .sort({
                createdAt: -1,
            })
            .limit(limit);
    }

    /**
     * =====================================
     * Unresolved Feedback
     * =====================================
     */
    async unresolved() {
        return Feedback.find({
            resolved: false,
        }).sort({
            createdAt: -1,
        });
    }
}

export default new FeedbackService();