import {
    Routes,
    Route,
} from "react-router-dom";


// ==========================================================
// LAYOUT
// ==========================================================

import CustomerLayout
    from "./layouts/CustomerLayout";

import AdminLayout
    from "./layouts/AdminLayout";

import StaffLayout
    from "./layouts/StaffLayout";


// ==========================================================
// AUTH
// ==========================================================

import Login
    from "./pages/auth/Login";

import Register
    from "./pages/auth/Register";


// ==========================================================
// PROTECTED
// ==========================================================

import ProtectedRoute
    from "./components/ProtectedRoute";


// ==========================================================
// CUSTOMER
// ==========================================================

import Home
    from "./pages/customer/Home";

import FieldList
    from "./pages/customer/FieldList";

import FieldDetail
    from "./pages/customer/FieldDetail";

import BookingSchedule
    from "./pages/customer/BookingSchedule";

import BookingDetail
    from "./pages/customer/BookingDetail";

import BookingConfirm
    from "./pages/customer/BookingConfirm";

import BookingHistory
    from "./pages/customer/BookingHistory";

import Payment
    from "./pages/customer/Payment";

import BookingSuccess
    from "./pages/customer/BookingSuccess";

import Profile
    from "./pages/customer/Profile";


// ==========================================================
// ADMIN
// ==========================================================

import Dashboard
    from "./pages/admin/Dashboard";

import UserManagement
    from "./pages/admin/UserManagement";

import FieldTypeManagement
    from "./pages/admin/FieldTypeManagement";

import FieldManagement
    from "./pages/admin/FieldManagement";

import BookingManagement
    from "./pages/admin/BookingManagement";

import PaymentManagement
    from "./pages/admin/PaymentManagement";

import Report
    from "./pages/admin/Report";


// ==========================================================
// STAFF
// ==========================================================

import StaffDashboard
    from "./pages/staff/Dashboard";

import StaffFieldManagement
    from "./pages/staff/FieldManagement";

import StaffBookingManagement
    from "./pages/staff/BookingManagement";

import StaffPaymentManagement
    from "./pages/staff/PaymentManagement";

import StaffStatistics
    from "./pages/staff/Statistics";


// ==========================================================
// 403
// ==========================================================

function Forbidden() {

    return (

        <div
            style={{
                minHeight:
                    "100vh",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                textAlign:
                    "center",

                padding:
                    "40px",
            }}
        >

            <div>

                <h1
                    style={{
                        fontSize:
                            "80px",
                    }}
                >
                    403
                </h1>


                <h2>
                    Không có quyền truy cập
                </h2>


                <p>
                    Bạn không có quyền truy cập trang này.
                </p>


                <button
                    type="button"
                    onClick={() =>
                        window.history.back()
                    }
                    style={{
                        padding:
                            "8px 18px",

                        cursor:
                            "pointer",
                    }}
                >
                    Quay lại
                </button>

            </div>

        </div>
    );
}


// ==========================================================
// 404
// ==========================================================

function NotFound() {

    return (

        <div
            style={{
                minHeight:
                    "100vh",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                textAlign:
                    "center",

                padding:
                    "40px",
            }}
        >

            <div>

                <h1
                    style={{
                        fontSize:
                            "80px",
                    }}
                >
                    404
                </h1>


                <h2>
                    Không tìm thấy trang
                </h2>


                <p>
                    Đường dẫn bạn truy cập không tồn tại.
                </p>


                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    style={{
                        padding:
                            "8px 18px",

                        cursor:
                            "pointer",
                    }}
                >
                    Về trang chủ
                </button>

            </div>

        </div>
    );
}


// ==========================================================
// APP
// ==========================================================

function App() {

    return (

        <Routes>

            {/* ==================================================
                AUTH
            ================================================== */}

            <Route
                path="/login"
                element={
                    <Login />
                }
            />


            <Route
                path="/register"
                element={
                    <Register />
                }
            />


            {/* ==================================================
                CUSTOMER PUBLIC
            ================================================== */}

            <Route
                element={
                    <CustomerLayout />
                }
            >

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                <Route
                    path="/fields"
                    element={
                        <FieldList />
                    }
                />


                <Route
                    path="/fields/:id"
                    element={
                        <FieldDetail />
                    }
                />

            </Route>


            {/* ==================================================
                CUSTOMER PROTECTED
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "customer",
                        ]}
                    />
                }
            >

                <Route
                    element={
                        <CustomerLayout />
                    }
                >

                    <Route
                        path="/booking"
                        element={
                            <BookingSchedule />
                        }
                    />


                    <Route
                        path="/booking/:id"
                        element={
                            <BookingDetail />
                        }
                    />


                    <Route
                        path="/booking-confirm"
                        element={
                            <BookingConfirm />
                        }
                    />


                    <Route
                        path="/payment"
                        element={
                            <Payment />
                        }
                    />


                    <Route
                        path="/booking-success"
                        element={
                            <BookingSuccess />
                        }
                    />


                    <Route
                        path="/booking-history"
                        element={
                            <BookingHistory />
                        }
                    />


                    <Route
                        path="/profile"
                        element={
                            <Profile />
                        }
                    />

                </Route>

            </Route>


            {/* ==================================================
                STAFF PROTECTED
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "staff",
                        ]}
                    />
                }
            >

                <Route
                    path="/staff"
                    element={
                        <StaffLayout />
                    }
                >

                    {/* /staff -> Dashboard */}

                    <Route
                        index
                        element={
                            <StaffDashboard />
                        }
                    />


                    {/* DASHBOARD */}

                    <Route
                        path="dashboard"
                        element={
                            <StaffDashboard />
                        }
                    />


                    {/* QUẢN LÝ SÂN */}

                    <Route
                        path="field-management"
                        element={
                            <StaffFieldManagement />
                        }
                    />


                    {/* QUẢN LÝ ĐẶT SÂN */}

                    <Route
                        path="booking-management"
                        element={
                            <StaffBookingManagement />
                        }
                    />


                    {/* QUẢN LÝ THANH TOÁN */}

                    <Route
                        path="payment-management"
                        element={
                            <StaffPaymentManagement />
                        }
                    />


                    {/* THỐNG KÊ */}

                    <Route
                        path="statistics"
                        element={
                            <StaffStatistics />
                        }
                    />

                </Route>

            </Route>


            {/* ==================================================
                ADMIN PROTECTED
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "admin",
                        ]}
                    />
                }
            >

                <Route
                    path="/admin"
                    element={
                        <AdminLayout />
                    }
                >

                    <Route
                        path="dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    <Route
                        path="users"
                        element={
                            <UserManagement />
                        }
                    />


                    <Route
                        path="field-types"
                        element={
                            <FieldTypeManagement />
                        }
                    />


                    <Route
                        path="fields"
                        element={
                            <FieldManagement />
                        }
                    />


                    <Route
                        path="bookings"
                        element={
                            <BookingManagement />
                        }
                    />


                    <Route
                        path="payments"
                        element={
                            <PaymentManagement />
                        }
                    />


                    <Route
                        path="report"
                        element={
                            <Report />
                        }
                    />

                </Route>

            </Route>


            {/* ==================================================
                403
            ================================================== */}

            <Route
                path="/403"
                element={
                    <Forbidden />
                }
            />


            {/* ==================================================
                404
            ================================================== */}

            <Route
                path="*"
                element={
                    <NotFound />
                }
            />

        </Routes>
    );
}


export default App;