import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
class AuthService {
    /**
     * =====================================================
     * Register
     * =====================================================
     */
    async register(data) {
        const emailExists = await User.findOne({
            email: data.email.toLowerCase(),
        });
        if (emailExists) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await User.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: hashedPassword,
            branch: data.branch ?? "",
            batch: data.batch ?? "",
            role: "student",
        });
        const token = jwt.sign({
            id: user.id,
            tokenVersion: user.tokenVersion ?? 0,
        }, env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return {
            user: user.toJSON(),
            token,
        };
    }
    /**
     * =====================================================
     * Login
     * =====================================================
     */
    async login(data) {
        const user = await User.findOne({
            email: data.email.toLowerCase(),
        }).select("+password");
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign({
            id: user.id,
            tokenVersion: user.tokenVersion ?? 0,
        }, env.JWT_SECRET, {
            expiresIn: "7d",
        });
        const userObject = user.toJSON();
        return {
            user: userObject,
            token,
        };
    }
    /**
     * =====================================================
     * Current User
     * =====================================================
     */
    async me(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    /**
     * =====================================================
     * Change Password
     * =====================================================
     */
    async changePassword(id, oldPassword, newPassword) {
        const user = await User.findById(id).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        const matched = await bcrypt.compare(oldPassword, user.password);
        if (!matched) {
            throw new Error("Old password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(id, {
            $set: {
                password: hashedPassword,
            },
            $inc: {
                tokenVersion: 1,
            },
        }, {
            new: true,
            runValidators: true,
        });
        return {
            success: true,
            message: "Password changed successfully",
        };
    }
    /**
     * =====================================================
     * Logout
     * =====================================================
     */
    async logout(id) {
        if (id) {
            await User.findByIdAndUpdate(id, {
                $inc: {
                    tokenVersion: 1,
                },
            }, {
                new: true,
                runValidators: true,
            });
        }
        return {
            success: true,
            message: "Logged out successfully",
        };
    }
}
export default new AuthService();
