import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // =============================
  // STATE
  // =============================

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  // =============================
  // KIỂM TRA ĐĂNG NHẬP
  // =============================

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    try {
      const savedToken =
        localStorage.getItem("token");

      const savedUser =
        localStorage.getItem("user");

      if (savedToken && savedUser) {
        const parsedUser =
          JSON.parse(savedUser);

        setToken(savedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(
        "Lỗi kiểm tra đăng nhập:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ĐĂNG NHẬP
  // =============================
  // Login.jsx hiện tại gọi:
  //
  // login(user, token)
  //
  // nên Context phải nhận đúng 2 tham số này.
  // =============================

  const login = async (userData, tokenData) => {
    try {
      const normalizedUser = {
        id: userData.id,

        fullName:
          userData.fullName ||
          userData.name ||
          "",

        name:
          userData.name ||
          userData.fullName ||
          "",

        phone:
          userData.phone || "",

        email:
          userData.email || "",

        dateOfBirth:
          userData.dateOfBirth || "",

        gender:
          userData.gender || "",

        address:
          userData.address || "",

        role:
        userData.role
          ? userData.role.toLowerCase()
          : "customer",
      };

      const finalToken =
        tokenData || "fake-token";

      // =============================
      // LƯU LOCAL STORAGE
      // =============================

      localStorage.setItem(
        "token",
        finalToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      // =============================
      // CẬP NHẬT CONTEXT
      // =============================

      setToken(finalToken);

      setUser(normalizedUser);

      setIsAuthenticated(true);

      console.log(
        "AuthContext - Login:",
        normalizedUser
      );

      return true;
    } catch (error) {
      console.error(
        "Lỗi login:",
        error
      );

      return false;
    }
  };

  // =============================
  // ĐĂNG KÝ
  // =============================

  const register = async (data) => {
    try {
      /*
       * SAU NÀY KHI CÓ BACKEND:
       *
       * await authService.register(data);
       *
       * Hiện tại Register.jsx đang tự lưu
       * user vào localStorage nên Context
       * chưa cần gọi API.
       */

      console.log(
        "AuthContext - Register:",
        data
      );

      return true;
    } catch (error) {
      console.error(
        "Lỗi đăng ký:",
        error
      );

      return false;
    }
  };

  // =============================
  // ĐĂNG XUẤT
  // =============================

  const logout = () => {
    /*
     * SAU NÀY:
     *
     * authService.logout();
     */

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);

    setIsAuthenticated(false);
  };

  // =============================
  // CẬP NHẬT USER
  // =============================

  const updateUser = (newUser) => {
    try {
      const updatedUser = {
        ...user,
        ...newUser,
      };

      // Cập nhật Context
      setUser(updatedUser);

      // Cập nhật localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      console.log(
        "AuthContext - User updated:",
        updatedUser
      );

      return true;
    } catch (error) {
      console.error(
        "Lỗi cập nhật user:",
        error
      );

      return false;
    }
  };

  // =============================
  // CONTEXT VALUE
  // =============================

  const value = {
    user,

    token,

    loading,

    isAuthenticated,

    login,

    register,

    logout,

    updateUser,
  };

  // =============================
  // PROVIDER
  // =============================

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// =============================
// useAuth
// =============================

export function useAuth() {
  return useContext(AuthContext);
}