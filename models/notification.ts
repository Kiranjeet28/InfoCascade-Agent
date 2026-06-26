import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification =
    mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);