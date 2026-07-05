import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        default: "",
        trim: true,
    },
    date: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    htmlContent: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const Notification = mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);
