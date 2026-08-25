import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =============================
// AUTH
// =============================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Nếu chưa có ForgotPassword thì KHÔNG import
// import ForgotPassword from "./pages/auth/ForgotPassword";

// =============================
// PROTECTED ROUTE
// =============================

import ProtectedRoute from "./components/ProtectedRoute";

// =============================
// CUSTOMER
// =============================

import Home from "./pages/customer/Home";

// =============================
// ADMIN
// =============================

// File của bạn tên Dashboard.jsx
import Dashboard from "./pages/admin/Dashboard";

// =============================
// 403
// =============================

function Forbidden() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "80px" }}>403</h1>

        <h2>Không có quyền truy cập</h2>

        <p>
          Bạn không có quyền truy cập trang này.
        </p>

        <button
          onClick={() => {
            window.history.back();
          }}
          style={{
            padding: "8px 18px",
            cursor: "pointer",
          }}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

// =============================
// 404
// =============================

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "80px" }}>404</h1>

        <h2>Không tìm thấy trang</h2>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            padding: "8px 18px",
            cursor: "pointer",
          }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

// =============================
// APP
// =============================

function App() {
  return (
    <Routes>

      {/* =========================
          AUTH
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================
          CUSTOMER
      ========================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["customer"]}
          />
        }
      >
        <Route
          path="/"
          element={<Home />}
        />
      </Route>


      {/* =========================
          ADMIN
      ========================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >
        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />
      </Route>


      {/* =========================
          403
      ========================= */}

      <Route
        path="/403"
        element={<Forbidden />}
      />


      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;