import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export interface UserQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: "student" | "admin";
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    branch: string;
    year: string;
    urn: string;
    crn: string;
    group: string;
    department: string;
    role?: "student" | "admin";
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    branch?: string;
    year?: string;
    urn?: string;
    crn?: string;
    group?: string;
    department?: string;
    role?: "student" | "admin";
}

class UserService {
    /**
     * Get all users
     */
    async getAll(query: UserQuery) {
        const {
            page = 1,
            pageSize = 10,
            search = "",
            role,
        } = query;

        const filter: any = {};

        if (role) {
            filter.role = role;
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
                    urn: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    crn: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const total = await User.countDocuments(filter);

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            items: users,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * Get user by id
     */
    async getById(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    /**
     * Get user by email
     */
    async getByEmail(email: string) {
        return User.findOne({
            email: email.toLowerCase(),
        }).select("+password");
    }

    /**
     * Create user
     */
    async create(data: CreateUserDto) {
        const emailExists = await User.findOne({
            email: data.email.toLowerCase(),
        });

        if (emailExists) {
            throw new Error("Email already exists");
        }

        const urnExists = await User.findOne({
            urn: data.urn,
        });

        if (urnExists) {
            throw new Error("URN already exists");
        }

        const crnExists = await User.findOne({
            crn: data.crn,
        });

        if (crnExists) {
            throw new Error("CRN already exists");
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );

        const user = await User.create({
            ...data,
            email: data.email.toLowerCase(),
            password: hashedPassword,
        });

        return user;
    }

    /**
     * Update user
     */
    async update(
        id: string,
        data: UpdateUserDto
    ) {
        if (data.password) {
            data.password = await bcrypt.hash(
                data.password,
                10
            );
        }

        const user = await User.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    /**
     * Delete user
     */
    async delete(id: string) {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            throw new Error("User not found");
        }

        return {
            success: true,
            message: "User deleted successfully",
        };
    }

    /**
     * Check email exists
     */
    async emailExists(email: string) {
        return User.exists({
            email: email.toLowerCase(),
        });
    }

    /**
     * Check URN exists
     */
    async urnExists(urn: string) {
        return User.exists({
            urn,
        });
    }

    /**
     * Check CRN exists
     */
    async crnExists(crn: string) {
        return User.exists({
            crn,
        });
    }

    /**
     * Count users
     */
    async count() {
        return User.countDocuments();
    }

    /**
     * Get all admins
     */
    async getAdmins() {
        return User.find({
            role: "admin",
        });
    }

    /**
     * Get all students
     */
    async getStudents() {
        return User.find({
            role: "student",
        });
    }
}

export default new UserService();