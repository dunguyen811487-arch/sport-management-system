import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ allowedRoles }) {
  const {
    isAuthenticated,
    user,
    loading,
  } = useAuth();

  // ==========================================
  // ĐANG KIỂM TRA LOGIN
  // ==========================================

  if (loading) {
    return <div>Đang tải...</div>;
  }

  // ==========================================
  // CHƯA ĐĂNG NHẬP
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // CHUẨN HÓA ROLE
  // Backend hiện tại có thể trả lowercase
  // ==========================================

  const userRole =
    user?.role?.toLowerCase();

  // ==========================================
  // KIỂM TRA QUYỀN
  // ==========================================

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles
      .map((role) => role.toLowerCase())
      .includes(userRole)
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  // ==========================================
  // CHO PHÉP
  // ==========================================

  return <Outlet />;
}

export default ProtectedRoute;