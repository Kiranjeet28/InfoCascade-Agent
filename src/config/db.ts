import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        console.log("✅ Connected to MongoDB");
        console.log("Database:", mongoose.connection.db?.databaseName);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}