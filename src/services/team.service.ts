import { Team } from "../models/Team.js";
import { escapeRegExp } from "../utils/escapeRegExp.js";

export interface TeamQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    department?: string;
    role?: string;
}

export interface CreateTeamDto {
    name: string;
    department: string;
    role: string;
    batch: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    avatarUrl?: string;
}

export interface UpdateTeamDto {
    name?: string;
    department?: string;
    role?: string;
    batch?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    avatarUrl?: string;
}

class TeamService {
    /**
     * =====================================
     * Create Team Member
     * =====================================
     */
    async create(data: CreateTeamDto) {
        return await Team.create(data);
    }

    /**
     * =====================================
     * Get All Team Members
     * =====================================
     */
    async getAll(query: TeamQuery) {
        const {
            page = 1,
            pageSize = 10,
            search = "",
            department,
            role,
        } = query;

        const filter: any = {};

        if (department) {
            filter.department = department;
        }

        if (role) {
            filter.role = role;
        }

        if (search.trim()) {
            const escapedSearch = escapeRegExp(search.trim());

            filter.$or = [
                {
                    name: {
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
                    role: {
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
            ];
        }

        const total = await Team.countDocuments(filter);

        const members = await Team.find(filter)
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            items: members,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * =====================================
     * Get Team Member By ID
     * =====================================
     */
    async getById(id: string) {
        const member = await Team.findById(id);

        if (!member) {
            throw new Error("Team member not found");
        }

        return member;
    }

    /**
     * =====================================
     * Update Team Member
     * =====================================
     */
    async update(
        id: string,
        data: UpdateTeamDto
    ) {
        const member = await Team.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!member) {
            throw new Error("Team member not found");
        }

        return member;
    }

    /**
     * =====================================
     * Delete Team Member
     * =====================================
     */
    async delete(id: string) {
        const member = await Team.findByIdAndDelete(id);

        if (!member) {
            throw new Error("Team member not found");
        }

        return {
            success: true,
            message: "Team member deleted successfully.",
        };
    }

    /**
     * =====================================
     * Count Team Members
     * =====================================
     */
    async count() {
        return Team.countDocuments();
    }

    /**
     * =====================================
     * Latest Team Members
     * =====================================
     */
    async latest(limit: number = 5) {
        const cappedLimit = Math.min(Math.max(limit, 1), 50);

        return Team.find()
            .sort({
                createdAt: -1,
            })
            .limit(cappedLimit);
    }
}

export default new TeamService();