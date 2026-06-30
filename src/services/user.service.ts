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
                    branch: {
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

    async getById(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async getByEmail(email: string) {
        return User.findOne({
            email: email.toLowerCase(),
        }).select("+password");
    }

    async create(data: CreateUserDto) {
        const emailExists = await User.findOne({
            email: data.email.toLowerCase(),
        });

        if (emailExists) {
            throw new Error("Email already exists");
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

    async update(id: string, data: UpdateUserDto) {
        if (data.password) {
            data.password = await bcrypt.hash(
                data.password,
                10
            );
        }

        if (data.email) {
            data.email = data.email.toLowerCase();
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

    async emailExists(email: string) {
        return User.exists({
            email: email.toLowerCase(),
        });
    }

    async count() {
        return User.countDocuments();
    }

    async getAdmins() {
        return User.find({
            role: "admin",
        });
    }

    async getStudents() {
        return User.find({
            role: "student",
        });
    }
}

export default new UserService();