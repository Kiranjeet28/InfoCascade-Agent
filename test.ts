import mongoose from "mongoose";
import "dotenv/config";

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

main();