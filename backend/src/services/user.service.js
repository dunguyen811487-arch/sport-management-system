const bcrypt = require("bcrypt");
const User = require("../models/user.model");


// ==========================================================
// GET ALL USERS
// ==========================================================

const getAllUsers = async () => {
    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return users;
};


// ==========================================================
// CREATE STAFF
// ==========================================================

const createStaff = async (data) => {
    const {
        fullName,
        phone,
        email,
        password
    } = data;


    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (!fullName || !fullName.trim()) {
        throw new Error("Họ tên là bắt buộc");
    }

    if (!phone || !phone.trim()) {
        throw new Error("Số điện thoại là bắt buộc");
    }

    if (!password || password.length < 6) {
        throw new Error(
            "Mật khẩu phải có ít nhất 6 ký tự"
        );
    }


    // ------------------------------------------------------
    // KIỂM TRA SỐ ĐIỆN THOẠI
    // ------------------------------------------------------

    const existingPhone = await User.findOne({
        phone: phone.trim()
    });

    if (existingPhone) {
        throw new Error(
            "Số điện thoại đã tồn tại"
        );
    }


    // ------------------------------------------------------
    // KIỂM TRA EMAIL
    // ------------------------------------------------------

    if (email && email.trim()) {

        const existingEmail =
            await User.findOne({
                email: email.trim()
            });

        if (existingEmail) {
            throw new Error(
                "Email đã tồn tại"
            );
        }
    }


    // ------------------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------------------

    const hashedPassword =
        await bcrypt.hash(password, 10);


    // ------------------------------------------------------
    // TẠO STAFF
    // ------------------------------------------------------

    const staff = await User.create({
        fullName: fullName.trim(),

        phone: phone.trim(),

        email:
            email && email.trim()
                ? email.trim()
                : undefined,

        password: hashedPassword,

        role: "staff"
    });


    // ------------------------------------------------------
    // KHÔNG TRẢ PASSWORD
    // ------------------------------------------------------

    const result =
        staff.toObject();

    delete result.password;


    return result;
};


// ==========================================================
// DELETE USER
// ==========================================================

const deleteUser = async (id) => {

    const user =
        await User.findByIdAndDelete(id);

    return user;
};


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
    getAllUsers,
    createStaff,
    deleteUser
};