const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {

        const user = await authService.register(
            req.body
        );

        res.status(201).json({
            message: "Đăng ký thành công",
            user
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

const login = async (req, res) => {
    try {

        const { phone, password } = req.body;

        const result = await authService.login(
            phone,
            password
        );

        res.json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

const profile = async (req, res) => {

    res.json({
        user: req.user
    });

};

module.exports = {
    register,
    login,
    profile
};