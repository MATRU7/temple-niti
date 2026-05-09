import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.DB_URL).then(async () => {
    try {
        await mongoose.connection.collection("users").dropIndex("sic_1");
        console.log("Dropped problematic index sic_1");
    } catch (e) {
        console.log("Error dropping index:", e.message);
    }
    process.exit(0);
});
