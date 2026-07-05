import mongoose, { Schema } from "mongoose";
const hiringSchema = new Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
export const Hiring = mongoose.models.Hiring ||
    mongoose.model("Hiring", hiringSchema);
export default Hiring;
