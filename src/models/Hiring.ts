import mongoose, { Schema, Document } from "mongoose";

export interface IHiring extends Document {
    fullName: string;
    email: string;
    department: string;
    batch: string;
    urn: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const hiringSchema = new Schema<IHiring>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        department: {
            type: String,
            required: true,
        },
        batch: {
            type: String,
            required: true,
        },
        urn: {
            type: String,
            required: true,
            match: /^\d{7}$/,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Hiring =
    mongoose.models.Hiring ||
    mongoose.model<IHiring>("Hiring", hiringSchema);
