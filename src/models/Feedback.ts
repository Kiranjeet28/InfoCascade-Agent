import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        category: {
            type: String,
            required: true,
            enum: ["Bug", "Feature", "UX", "Other"],
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        resolved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Feedback =
    mongoose.models.Feedback ||
    mongoose.model("Feedback", feedbackSchema);
