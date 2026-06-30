import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        batch: {
            type: String,
            required: true,
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },
        linkedin: {
            type: String,
            default: null,
        },

        github: {
            type: String,
            default: null,
        },

        email: {
            type: String,
            default: null,
            lowercase: true,
            trim: true,
        },

        avatarUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Team =
    mongoose.models.Team ||
    mongoose.model("Team", teamSchema);
