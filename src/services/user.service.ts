import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { escapeRegExp } from "../utils/escapeRegExp.js";
import { AppError } from "../utils/AppError.js";

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
    branch?: string;
    batch?: string;
    role?: "student" | "admin";
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    branch?: string;
    batch?: string;
    role?: "student" | "admin";
}

class UserService {
    /**
     * ===========================================
     * Get All Users
     * ===========================================
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
            const escapedSearch = escapeRegExp(search.trim());

            filter.$or = [
                {
                    name: {
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
                    branch: {
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
     * ===========================================
     * Get User By ID
     * ===========================================
     */
    async getById(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    /**
     * ===========================================
     * Get User By Email
     * ===========================================
     */
    async getByEmail(email: string) {
        return User.findOne({
            email: email.toLowerCase(),
        }).select("+password");
    }

    /**
     * ===========================================
     * Create User
     * ===========================================
     */
    async create(data: CreateUserDto) {
        const normalizedEmail = data.email.toLowerCase();

        if (!normalizedEmail.endsWith("@gmail.com")) {
            throw new AppError(
                "Only Gmail addresses are allowed",
                400
            );
        }

        const emailExists = await User.findOne({
            email: normalizedEmail,
        });

        if (emailExists) {
            throw new AppError("Email already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );

        const user = await User.create({
            name: data.name,
            email: normalizedEmail,
            password: hashedPassword,
            branch: data.branch ?? "",
            batch: data.batch ?? "",
            role: data.role ?? "student",
        });

        return user;
    }

    /**
     * ===========================================
     * Update User
     * ===========================================
     */
    async update(
        id: string,
        data: UpdateUserDto
    ) {
        if (data.email) {
            data.email = data.email.toLowerCase();

            if (!data.email.endsWith("@gmail.com")) {
                throw new AppError(
                    "Only Gmail addresses are allowed",
                    400
                );
            }

            const emailExists = await User.findOne({
                email: data.email,
                _id: {
                    $ne: id,
                },
            });

            if (emailExists) {
                throw new AppError(
                    "Email already exists",
                    409
                );
            }
        }

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
     * ===========================================
     * Delete User
     * ===========================================
     */
    async delete(id: string) {
        const user = await User.findByIdAndDelete(
            id
        );

        if (!user) {
            throw new Error("User not found");
        }

        return {
            success: true,
            message: "User deleted successfully",
        };
    }

    /**
     * ===========================================
     * Email Exists
     * ===========================================
     */
    async emailExists(email: string) {
        return User.exists({
            email: email.toLowerCase(),
        });
    }

    /**
     * ===========================================
     * Total Users
     * ===========================================
     */
    async count() {
        return User.countDocuments();
    }

    /**
     * ===========================================
     * Get Admins
     * ===========================================
     */
    async getAdmins() {
        return User.find({
            role: "admin",
        }).sort({
            createdAt: -1,
        });
    }

    /**
     * ===========================================
     * Get Students
     * ===========================================
     */
    async getStudents() {
        return User.find({
            role: "student",
        }).sort({
            createdAt: -1,
        });
    }

    /**
     * ===========================================
     * Update User Role
     * ===========================================
     */
    async updateRole(
        id: string,
        role: "student" | "admin"
    ) {
        const user = await User.findByIdAndUpdate(
            id,
            {
                role,
            },
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
}

export default new UserService();