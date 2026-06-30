import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        branch: {
            type: String,
            default: "",
            trim: true,
        },

        batch: {
            type: String,
            default: "",
            trim: true,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },

        subscribedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Virtual id field
userSchema.virtual("id").get(function () {
    return this._id.toString();
});

// Convert document to JSON
userSchema.set("toJSON", {
    virtuals: true,
    transform: (_doc, ret: any) => {
        delete ret._id;
        delete ret.password;
        return ret;
    },
});

export const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;