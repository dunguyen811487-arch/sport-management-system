import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import StaffSidebar from "../components/staff/StaffSidebar";

function StaffLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <StaffSidebar />
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default StaffLayout;