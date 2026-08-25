const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/user.model");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const phone = "0123456789";
        const password = "admin123";

        const existingAdmin = await User.findOne({
            phone
        });

        if (existingAdmin) {

            if (existingAdmin.role === "admin") {
                console.log("Tài khoản Admin đã tồn tại.");
            } else {
                existingAdmin.role = "admin";

                await existingAdmin.save();

                console.log(
                    "Đã nâng tài khoản thành Admin."
                );
            }

            return;
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const admin = await User.create({
            fullName: "Administrator",
            phone,
            email: "admin@sport.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log(
            "Tạo Admin thành công:"
        );

        console.log(
            "Phone:",
            admin.phone
        );

        console.log(
            "Password:",
            password
        );

    } catch (error) {

        console.error(
            "Create Admin error:",
            error
        );

    } finally {

        await mongoose.disconnect();

    }
};

createAdmin();