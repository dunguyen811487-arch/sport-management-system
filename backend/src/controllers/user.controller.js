const userService = require("../services/user.service");


// ==========================================================
// GET ALL USERS
// ==========================================================

const getAllUsers = async (req, res) => {
    try {

        const users =
            await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        console.error(
            "Get all users error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================================
// CREATE STAFF
// ==========================================================

const createStaff = async (req, res) => {
    try {

        const staff =
            await userService.createStaff(
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Tạo tài khoản Staff thành công",
            data: staff
        });

    } catch (error) {

        console.error(
            "Create staff error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================================
// DELETE USER
// ==========================================================

const deleteUser = async (req, res) => {
    try {

        const user =
            await userService.deleteUser(
                req.params.id
            );


        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy tài khoản"
            });
        }


        res.status(200).json({
            success: true,
            message:
                "Xóa tài khoản thành công",
            data: user
        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getAllUsers,
    createStaff,
    deleteUser
};