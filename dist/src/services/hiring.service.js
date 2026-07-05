import Hiring from "../models/Hiring.js";
import { escapeRegExp } from "../utils/escapeRegExp.js";
class HiringService {
    /**
     * =====================================
     * Submit Hiring Form
     * =====================================
     */
    async create(data) {
        const application = await Hiring.create({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            department: data.department,
            batch: data.batch,
            urn: data.urn,
        });
        return application;
    }
    /**
     * =====================================
     * Get All Applications
     * =====================================
     */
    async getAll(query) {
        const { page = 1, pageSize = 10, search = "", } = query;
        const filter = {};
        if (search.trim()) {
            const escapedSearch = escapeRegExp(search.trim());
            filter.$or = [
                {
                    fullName: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
                {
                    department: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
                {
                    batch: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
                {
                    urn: {
                        $regex: escapedSearch,
                        $options: "i",
                    },
                },
            ];
        }
        const total = await Hiring.countDocuments(filter);
        const applications = await Hiring.find(filter)
            .sort({
            createdAt: -1,
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return {
            items: applications,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    /**
     * =====================================
     * Get By ID
     * =====================================
     */
    async getById(id) {
        const application = await Hiring.findById(id);
        if (!application) {
            throw new Error("Application not found");
        }
        return application;
    }
    /**
     * =====================================
     * Delete Application
     * =====================================
     */
    async delete(id) {
        const application = await Hiring.findByIdAndDelete(id);
        if (!application) {
            throw new Error("Application not found");
        }
        return {
            success: true,
            message: "Application deleted successfully.",
        };
    }
    /**
     * =====================================
     * Total Applications
     * =====================================
     */
    async count() {
        return Hiring.countDocuments();
    }
    /**
     * =====================================
     * Latest Applications
     * =====================================
     */
    async latest(limit = 5) {
        const cappedLimit = Math.min(Math.max(limit, 1), 50);
        return Hiring.find()
            .sort({
            createdAt: -1,
        })
            .limit(cappedLimit);
    }
}
export default new HiringService();
