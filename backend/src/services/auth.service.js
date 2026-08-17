const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER - CUSTOMER
// ======================================================

const register = async (data) => {

    const existingUser = await User.findOne({
        phone: data.phone
    });

    if (existingUser) {
        throw new Error("Số điện thoại đã tồn tại");
    }

    if (data.email) {
        const existingEmail = await User.findOne({
            email: data.email
        });

        if (existingEmail) {
            throw new Error("Email đã tồn tại");
        }
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await User.create({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,

        // Người dùng đăng ký luôn là customer
        role: "customer"
    });

    // Không trả password về client
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
};


// ======================================================
// LOGIN - CUSTOMER / STAFF / ADMIN
// ======================================================

const login = async (phone, password) => {

    const user = await User.findOne({
        phone
    });

    if (!user) {
        throw new Error("Tài khoản không tồn tại");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Sai mật khẩu");
    }

    // JWT chứa ID + ROLE
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    // Không trả password
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        token,
        user: userResponse
    };
};

const updateProfile = async (userId, data) => {
    const {
        fullName,
        phone,
        email
    } = data;

    if (!fullName?.trim()) {
        throw new Error("Họ tên không được để trống");
    }

    const existingPhone = await User.findOne({
        phone: phone.trim(),
        _id: { $ne: userId }
    });

    if (existingPhone) {
        throw new Error("Số điện thoại đã tồn tại");
    }

    if (email?.trim()) {
        const existingEmail = await User.findOne({
            email: email.trim(),
            _id: { $ne: userId }
        });

        if (existingEmail) {
            throw new Error("Email đã tồn tại");
        }
    }

    const user =
        await User.findByIdAndUpdate(
            userId,
            {
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email?.trim() || undefined
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

    if (!user) {
        throw new Error("Không tìm thấy tài khoản");
    }

    return user;
};
module.exports = {
    register,
    login,
    updateProfile
};