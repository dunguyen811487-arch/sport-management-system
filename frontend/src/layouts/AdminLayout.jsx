
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= ADMIN BODY ================= */}

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "calc(100vh - 56px)",
        }}
      >
        {/* ================= SIDEBAR ================= */}

        <div
          style={{
            width: "250px",
            minWidth: "250px",
            height: "100%",
          }}
        >
          <AdminSidebar />
        </div>

        {/* ================= CONTENT ================= */}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

