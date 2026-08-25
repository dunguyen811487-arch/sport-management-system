import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;