import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginApi,
    getProfileApi,
} from "../api/authApi";


// ==========================================================
// CONTEXT
// ==========================================================

export const AuthContext =
    createContext(null);


// ==========================================================
// GET STORED USER
// Chỉ nhận User thật, không nhận JWT payload
// ==========================================================

const getStoredUser = () => {

    try {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const parsedUser =
            JSON.parse(storedUser);

        // JWT payload thường chỉ có:
        // id, role, iat, exp
        //
        // User thật phải có fullName/name

        if (
            !parsedUser ||
            (
                !parsedUser.fullName &&
                !parsedUser.name
            )
        ) {
            return null;
        }

        return parsedUser;

    } catch (error) {

        console.error(
            "Không đọc được user từ localStorage:",
            error
        );

        localStorage.removeItem(
            "user"
        );

        return null;
    }
};


// ==========================================================
// PROVIDER
// ==========================================================

export function AuthProvider({
    children,
}) {

    // Khôi phục User thật ngay khi app mở
    const [user, setUser] =
        useState(
            getStoredUser()
        );

    const [loading, setLoading] =
        useState(true);


    // ======================================================
    // RESTORE SESSION
    // ======================================================

    const restoreSession = async () => {

        const token =
            localStorage.getItem("token");


        // Không có token
        if (!token) {

            setUser(null);

            setLoading(false);

            return;
        }


        // Có token
        try {

            const response =
                await getProfileApi();

            const currentUser =
                response?.user;


            // Backend phải trả User thật
            if (!currentUser) {

                throw new Error(
                    "API profile không trả về user"
                );
            }


            // ----------------------------------------------
            // USER THẬT TỪ MONGODB
            // ----------------------------------------------

            setUser(
                currentUser
            );


            // ----------------------------------------------
            // LƯU USER THẬT
            // ----------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    currentUser
                )
            );

        } catch (error) {

            console.error(
                "Restore session error:",
                error
            );


            // Chỉ xóa session khi backend
            // thực sự trả 401
            if (
                error?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                setUser(null);
            }

        } finally {

            setLoading(false);
        }
    };


    // ======================================================
    // RESTORE KHI APP KHỞI ĐỘNG
    // ======================================================

    useEffect(() => {

        restoreSession();

    }, []);


    // ======================================================
    // LOGIN
    // ======================================================

    const loginWithApi = async (
        phone,
        password
    ) => {

        try {

            const response =
                await loginApi({
                    phone,
                    password,
                });


            if (!response) {

                return {
                    success: false,
                    message:
                        "Backend không trả về dữ liệu đăng nhập",
                };
            }


            if (!response.token) {

                return {
                    success: false,
                    message:
                        response.message ||
                        "Backend không trả về JWT token",
                };
            }


            if (!response.user) {

                return {
                    success: false,
                    message:
                        "Backend không trả về thông tin người dùng",
                };
            }


            // ----------------------------------------------
            // TOKEN
            // ----------------------------------------------

            localStorage.setItem(
                "token",
                response.token
            );


            // ----------------------------------------------
            // USER THẬT
            // ----------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.user
                )
            );


            // ----------------------------------------------
            // STATE
            // ----------------------------------------------

            setUser(
                response.user
            );


            return {
                success: true,

                token:
                    response.token,

                user:
                    response.user,

                message:
                    response.message ||
                    "Đăng nhập thành công",
            };

        } catch (error) {

            console.error(
                "loginWithApi error:",
                error
            );

            return {
                success: false,

                message:
                    error?.data?.message ||
                    error?.message ||
                    "Đăng nhập thất bại",
            };
        }
    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);
    };


    // ======================================================
    // UPDATE USER
    // ======================================================

    const updateUser = (
        updatedUser
    ) => {

        setUser(
            updatedUser
        );

        localStorage.setItem(
            "user",
            JSON.stringify(
                updatedUser
            )
        );
    };


    // ======================================================
    // AUTH STATUS
    // ======================================================

    const isAuthenticated =
        !!user &&
        !!localStorage.getItem(
            "token"
        );


    // ======================================================
    // VALUE
    // ======================================================

    const value = {

        user,

        loading,

        isAuthenticated,

        loginWithApi,

        logout,

        updateUser,

        restoreSession,
    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}


// ==========================================================
// HOOK
// ==========================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        );

    if (!context) {

        throw new Error(
            "useAuth phải được sử dụng bên trong AuthProvider"
        );
    }

    return context;
}


export default AuthContext;