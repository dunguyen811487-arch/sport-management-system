const authService =
    require("../services/auth.service");

const User =
    require("../models/user.model");


// ==========================================================
// REGISTER
// ==========================================================

const register = async (
    req,
    res
) => {

    try {

        const user =
            await authService.register(
                req.body
            );

        res.status(201).json({
            message:
                "Đăng ký thành công",
            user
        });

    } catch (error) {

        res.status(400).json({
            message:
                error.message
        });

    }
};


// ==========================================================
// LOGIN
// ==========================================================

const login = async (
    req,
    res
) => {

    try {

        const {
            phone,
            password
        } = req.body;


        const result =
            await authService.login(
                phone,
                password
            );


        res.status(200).json(
            result
        );

    } catch (error) {

        res.status(400).json({
            message:
                error.message
        });

    }
};


// ==========================================================
// PROFILE
// ==========================================================
// req.user chỉ chứa JWT payload:
// {
//    id,
//    role,
//    iat,
//    exp
// }
//
// Không trả req.user trực tiếp.
// Phải lấy User thật từ MongoDB.
// ==========================================================

const profile = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.user.id
            ).select(
                "-password"
            );


        if (!user) {

            return res.status(404).json({
                message:
                    "Không tìm thấy tài khoản"
            });

        }


        // ==================================================
        // KHÔNG CHO CACHE RESPONSE
        // ==================================================

        res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate"
        );

        res.setHeader(
            "Pragma",
            "no-cache"
        );

        res.setHeader(
            "Expires",
            "0"
        );


        // ==================================================
        // USER THẬT TỪ MONGODB
        // ==================================================

        return res.status(200).json({
            user
        });

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        return res.status(500).json({
            message:
                error.message
        });

    }
};


// ==========================================================
// UPDATE PROFILE
// ==========================================================

const updateProfile = async (
    req,
    res
) => {

    try {

        const user =
            await authService.updateProfile(
                req.user.id,
                req.body
            );


        return res.status(200).json({
            message:
                "Cập nhật hồ sơ thành công",
            user
        });

    } catch (error) {

        return res.status(400).json({
            message:
                error.message
        });

    }
};


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
    register,
    login,
    profile,
    updateProfile
};