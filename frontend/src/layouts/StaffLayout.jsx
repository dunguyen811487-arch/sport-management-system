import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import StaffSidebar from "../components/staff/StaffSidebar";

import "../assets/styles/staff-layout.css";


function StaffLayout() {

    return (
        <div className="staff-layout">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header className="staff-navbar">

                <Navbar />

            </header>


            {/* ==================================================
                BODY
            ================================================== */}

            <div className="staff-body">

                {/* SIDEBAR */}

                <aside className="staff-sidebar-wrapper">

                    <StaffSidebar />

                </aside>


                {/* CONTENT */}

                <main className="staff-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default StaffLayout;