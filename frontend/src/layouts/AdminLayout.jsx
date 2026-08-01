import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div>
            <h2>Navbar</h2>

            <hr />

            <div style={{ display: "flex" }}>
                <div
                    style={{
                        width: "220px",
                        background: "#f2f2f2",
                        padding: "20px",
                    }}
                >
                    Sidebar
                </div>

                <div
                    style={{
                        flex: 1,
                        padding: "20px",
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;