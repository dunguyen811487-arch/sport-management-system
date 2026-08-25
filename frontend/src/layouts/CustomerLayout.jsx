import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import Footer from "../components/customer/Footer";

import "../assets/styles/layout.css";


function CustomerLayout() {

    return (
        <div className="customer-layout">

            {/* NAVBAR */}

            <header className="customer-navbar">

                <Navbar />

            </header>


            {/* BODY */}

            <div className="customer-body">

                {/* SIDEBAR */}

                <aside className="customer-sidebar-wrapper">

                    <CustomerSidebar />

                </aside>


                {/* CONTENT */}

                <main className="customer-main">

                    <Outlet />

                    {/* FOOTER */}

                    <Footer />

                </main>

            </div>

        </div>
    );
}


export default CustomerLayout;