import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";


function ProtectedRoute({
    allowedRoles = [],
}) {

    const {
        isAuthenticated,
        user,
    } = useAuth();


    const location =
        useLocation();


    // ==========================================================
    // CHƯA ĐĂNG NHẬP
    // ==========================================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                state={{
                    from:
                        location.pathname,
                }}
                replace
            />
        );
    }


    // ==========================================================
    // ROLE
    // ==========================================================

    const userRole =
        String(
            user?.role || ""
        ).toLowerCase();


    const normalizedRoles =
        allowedRoles.map(
            role =>
                String(
                    role
                ).toLowerCase()
        );


    // ==========================================================
    // KIỂM TRA QUYỀN
    // ==========================================================

    if (
        normalizedRoles.length > 0 &&
        !normalizedRoles.includes(
            userRole
        )
    ) {

        return (
            <Navigate
                to="/403"
                replace
            />
        );
    }


    // ==========================================================
    // OK
    // ==========================================================

    return <Outlet />;
}


export default ProtectedRoute;