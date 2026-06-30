import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { env } from "../config/env.js";

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    branch: string;
    year: string;
    urn: string;
    crn: string;
    group: string;
    department: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

class AuthService {
    /**
     * Register User
     */
    async register(data: RegisterDto) {
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
            role: "student",
        });

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return {
            user,
            token,
        };
    }

    /**
     * Login
     */
    async login(data: LoginDto) {
        const user = await User.findOne({
            email: data.email.toLowerCase(),
        }).select("+password");

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!validPassword) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        const userObject = user.toJSON();

        return {
            user: userObject,
            token,
        };
    }

    /**
     * Current User
     */
    async me(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    /**
     * Change Password
     */
    async changePassword(
        id: string,
        oldPassword: string,
        newPassword: string
    ) {
        const user = await User.findById(id).select("+password");

        if (!user) {
            throw new Error("User not found");
        }

        const matched = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!matched) {
            throw new Error("Old password is incorrect");
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        return {
            success: true,
            message: "Password changed successfully",
        };
    }

    /**
     * Logout
     */
    async logout() {
        return {
            success: true,
            message: "Logged out successfully",
        };
    }
}

export default new AuthService();