import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import StaffLayout from "../layouts/StaffLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/ProtectedRoute";

// ================= Auth =================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ================= Customer =================

import Home from "../pages/customer/Home";
import FieldList from "../pages/customer/FieldList";
import FieldDetail from "../pages/customer/FieldDetail";

import Booking from "../pages/customer/BookingSchedule";
import BookingConfirm from "../pages/customer/BookingConfirm";
import BookingSuccess from "../pages/customer/BookingSuccess";
import BookingHistory from "../pages/customer/BookingHistory";
import BookingDetail from "../pages/customer/BookingDetail";

import Payment from "../pages/customer/Payment";
import Profile from "../pages/customer/Profile";

// ================= Staff =================

import Dashboard from "../pages/staff/Dashboard";
import FieldManagement from "../pages/staff/FieldManagement";
import BookingManagement from "../pages/staff/BookingManagement";
import PaymentManagement from "../pages/staff/PaymentManagement";
import Statistics from "../pages/staff/Statistics";

// ================= Admin =================

import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import FieldTypeManagement from "../pages/admin/FieldTypeManagement";
import Report from "../pages/admin/Report";

// ================= Common =================

import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";


function AppRoutes() {
  return (
    <Routes>

      {/* =========================================
          PUBLIC
      ========================================== */}

      <Route element={<MainLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/fields"
          element={<FieldList />}
        />

        <Route
          path="/fields/:id"
          element={<FieldDetail />}
        />

      </Route>


      {/* =========================================
          AUTH
      ========================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================================
          CUSTOMER
      ========================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["customer"]}
          />
        }
      >

        <Route element={<MainLayout />}>

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/booking-confirm"
            element={<BookingConfirm />}
          />

          <Route
            path="/booking-success"
            element={<BookingSuccess />}
          />

          <Route
            path="/booking-history"
            element={<BookingHistory />}
          />

          <Route
            path="/booking-history/:id"
            element={<BookingDetail />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Route>


      {/* ================= Staff ================= */}

<Route
  element={
    <ProtectedRoute
      allowedRoles={["staff"]}
    />
  }
>
  <Route element={<StaffLayout />}>

    <Route
      path="/staff/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/staff/field-management"
      element={<FieldManagement />}
    />

    <Route
      path="/staff/booking-management"
      element={<BookingManagement />}
    />

    <Route
      path="/staff/payment-management"
      element={<PaymentManagement />}
    />

    <Route
      path="/staff/statistics"
      element={<Statistics />}
    />

  </Route>
</Route>


      {/* ================= Admin ================= */}

<Route
  element={
    <ProtectedRoute
      allowedRoles={["admin"]}
    />
  }
>
  <Route element={<AdminLayout />}>

    <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin/users"
      element={<UserManagement />}
    />

    <Route
      path="/admin/field-types"
      element={<FieldTypeManagement />}
    />

    <Route
      path="/admin/report"
      element={<Report />}
    />

  </Route>
</Route>


      {/* =========================================
          FORBIDDEN
      ========================================== */}

      <Route
        path="/403"
        element={<Forbidden />}
      />


      {/* =========================================
          NOT FOUND
      ========================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;