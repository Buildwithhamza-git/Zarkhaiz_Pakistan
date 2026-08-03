const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

// ✅ Load .env properly
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env"),
});

const { User } = require("../features/users/user.model");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@zarkhaiz.pk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`⏭️  Admin already exists (${ADMIN_EMAIL}). Skipping.`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await User.create({
            firstname: "Zarkhaiz",
            lastname: "Admin",
            username: "zarkhaizadmin",
            email: ADMIN_EMAIL,
            phone: "+923000000000",
            password: hashedPassword,
            role: "admin",
            sellerStatus: "none",
            isVerified: true,
        });

        console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
        console.log("🔑 Default password: " + ADMIN_PASSWORD);
        console.log("⚠️  Change the password after first login.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Admin Seeder Error:", err.message);
        process.exit(1);
    }
};

seedAdmin();
