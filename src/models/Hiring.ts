import mongoose, { Schema, Document } from "mongoose";

export interface IHiring extends Document {
    fullName: string;
    email: string;
    department: string;
    batch: string;
    urn: string;
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
            lowercase: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        batch: {
            type: String,
            required: true,
            trim: true,
        },

        urn: {
            type: String,
            required: true,
            match: [/^\d{7}$/, "URN must contain exactly 7 digits"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Hiring =
    mongoose.models.Hiring ||
    mongoose.model<IHiring>("Hiring", hiringSchema);

export default Hiring;