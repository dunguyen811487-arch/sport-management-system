import {
    NavLink,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "../../assets/styles/sidebar.css";


function StaffSidebar() {

    const {
        user,
        logout,
    } = useAuth();


    // ==========================================================
    // USER NAME
    // ==========================================================

    const displayName =
        user?.fullName ||
        user?.name ||
        "Nhân viên";


    const avatarLetter =
        displayName
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "S";


    // ==========================================================
    // LINK CLASS
    // ==========================================================

    const getLinkClass =
        ({
            isActive
        }) => {

            return isActive
                ? "staff-sidebar-link active"
                : "staff-sidebar-link";
        };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <aside className="staff-sidebar">

            {/* ==================================================
                MENU
            ================================================== */}

            <nav className="staff-sidebar-menu">

                <NavLink
                    to="/staff/dashboard"
                    className={
                        getLinkClass
                    }
                >

                    <i className="bi bi-speedometer2"></i>

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                <NavLink
                    to="/staff/field-management"
                    className={
                        getLinkClass
                    }
                >

                    <i className="bi bi-grid-3x3-gap-fill"></i>

                    <span>
                        Quản lý sân
                    </span>

                </NavLink>


                <NavLink
                    to="/staff/booking-management"
                    className={
                        getLinkClass
                    }
                >

                    <i className="bi bi-calendar-check-fill"></i>

                    <span>
                        Quản lý đặt sân
                    </span>

                </NavLink>


                <NavLink
                    to="/staff/payment-management"
                    className={
                        getLinkClass
                    }
                >

                    <i className="bi bi-credit-card-fill"></i>

                    <span>
                        Thanh toán
                    </span>

                </NavLink>


                <NavLink
                    to="/staff/statistics"
                    className={
                        getLinkClass
                    }
                >

                    <i className="bi bi-bar-chart-fill"></i>

                    <span>
                        Thống kê
                    </span>

                </NavLink>

            </nav>


            {/* ==================================================
                BOTTOM
            ================================================== */}

            <div className="staff-sidebar-bottom">

                <hr />


                <div className="staff-sidebar-user">

                    <div className="staff-avatar">

                        {avatarLetter}

                    </div>


                    <div className="staff-user-info">

                        <strong>
                            {displayName}
                        </strong>

                        <small>
                            Staff
                        </small>

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-danger w-100 mt-3"
                    onClick={
                        logout
                    }
                >

                    <i className="bi bi-box-arrow-right me-2"></i>

                    Đăng xuất

                </button>

            </div>

        </aside>
    );
}


export default StaffSidebar;