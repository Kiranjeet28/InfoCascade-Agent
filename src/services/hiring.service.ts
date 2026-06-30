import Hiring from "../models/Hiring.js";

export interface HiringQuery {
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface CreateHiringDto {
    fullName: string;
    email: string;
    department: string;
    batch: string;
    urn: string;
}

class HiringService {
    /**
     * =====================================
     * Submit Hiring Form
     * =====================================
     */
    async create(data: CreateHiringDto) {
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
    async getAll(query: HiringQuery) {
        const {
            page = 1,
            pageSize = 10,
            search = "",
        } = query;

        const filter: any = {};

        if (search.trim()) {
            filter.$or = [
                {
                    fullName: {
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
                    department: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    batch: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    urn: {
                        $regex: search,
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
    async getById(id: string) {
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
    async delete(id: string) {
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
    async latest(limit: number = 5) {
        return Hiring.find()
            .sort({
                createdAt: -1,
            })
            .limit(limit);
    }
}

export default new HiringService();