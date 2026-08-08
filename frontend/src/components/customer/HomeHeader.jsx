import { Link } from "react-router-dom";
import "../../assets/styles/homeHeader.css";

function HomeHeader() {

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="home-header">

      <div className="header-left">

        <div className="avatar-circle">
          N
        </div>

        <div>

          <p>{today}</p>

          <h2>Nguyễn Gia Nguyên</h2>

          <span>Chào mừng quay trở lại</span>

        </div>

      </div>

      <div className="header-right">

        <button className="notify-btn">

          <i className="bi bi-bell-fill"></i>

        </button>

        <Link
          to="/customer/profile"
          className="profile-btn"
        >

          Hồ sơ

        </Link>

      </div>

    </div>
  );
}

export default HomeHeader;