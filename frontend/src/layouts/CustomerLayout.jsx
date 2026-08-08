import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import CustomerSidebar from "../components/customer/CustomerSidebar";

import "../assets/styles/layout.css";

function CustomerLayout() {
  return (
    <>
      <Navbar />

      <div className="layout-container">

        <CustomerSidebar />

        <main className="layout-content">
          <Outlet />
        </main>

      </div>
    </>
  );
}

export default CustomerLayout;