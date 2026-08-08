import { Outlet } from "react-router-dom";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import "../assets/styles/layout.css";

function MainLayout() {
  return (
    <div className="layout-container">

      <CustomerSidebar />

      <main className="layout-content">
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;