const User = require("../models/user.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const register = async (data) => {

    const existingUser = await User.findOne({
        phone: data.phone
    });

    if (existingUser) {
        throw new Error("Số điện thoại đã tồn tại");
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
        role: "customer"
    });

    return user;
};

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

    return {
        token,
        user
    };
};

module.exports = {
    register,
    login
};