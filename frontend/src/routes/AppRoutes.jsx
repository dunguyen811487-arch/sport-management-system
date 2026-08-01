import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import FieldManagement from "../pages/FieldManagement";
import Booking from "../pages/Booking";
import BookingHistory from "../pages/BookingHistory";
import Payment from "../pages/Payment";
import Profile from "../pages/Profile";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/field-management" element={<FieldManagement />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/booking-history" element={<BookingHistory />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;