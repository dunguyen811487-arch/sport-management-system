import "../../assets/styles/footer.css";


function Footer() {

    const contactEmail =
        "admin123@example.com";

    const contactPhone =
        "0123 456 789";


    return (

        <footer className="customer-footer">

            <div className="footer-container">

                {/* BRAND */}

                <div className="footer-column footer-brand">

                    <h4>

                        <i className="bi bi-trophy-fill me-2"></i>

                        Sport Management

                    </h4>


                    <p>

                        Hệ thống quản lý và đặt sân thể thao
                        nhanh chóng, tiện lợi và dễ sử dụng.

                    </p>

                </div>


                {/* DỊCH VỤ */}

                <div className="footer-column">

                    <h5>
                        Dịch vụ
                    </h5>


                    <a href="/fields">
                        Danh sách sân
                    </a>


                    <a href="/booking">
                        Đặt sân
                    </a>


                    <a href="/booking-history">
                        Lịch sử đặt sân
                    </a>

                </div>


                {/* HỖ TRỢ */}

                <div className="footer-column">

                    <h5>
                        Hỗ trợ
                    </h5>


                    <a href="/">
                        Trang chủ
                    </a>


                    <a href="/profile">
                        Hồ sơ
                    </a>


                    <a href="/">
                        Điều khoản sử dụng
                    </a>

                </div>


                {/* LIÊN HỆ */}

                <div className="footer-column">

                    <h5>
                        Liên hệ
                    </h5>


                    <div className="footer-contact">

                        <i className="bi bi-envelope-fill"></i>

                        <a
                            href={
                                `mailto:${contactEmail}`
                            }
                        >
                            {contactEmail}
                        </a>

                    </div>


                    <div className="footer-contact">

                        <i className="bi bi-telephone-fill"></i>

                        <a
                            href={
                                `tel:${contactPhone.replace(
                                    /\s/g,
                                    ""
                                )}`
                            }
                        >
                            {contactPhone}
                        </a>

                    </div>


                    <div className="footer-contact">

                        <i className="bi bi-geo-alt-fill"></i>

                        <span>
                            Việt Nam
                        </span>

                    </div>

                </div>

            </div>


            {/* BOTTOM */}

            <div className="footer-bottom">

                <div>

                    © {new Date().getFullYear()}{" "}

                    <strong>
                        Sport Management
                    </strong>

                    . All rights reserved.

                </div>


                <div className="footer-social">

                    <a
                        href="#"
                        aria-label="Facebook"
                    >
                        <i className="bi bi-facebook"></i>
                    </a>


                    <a
                        href="#"
                        aria-label="Zalo"
                    >
                        <i className="bi bi-chat-dots-fill"></i>
                    </a>


                    <a
                        href={
                            `mailto:${contactEmail}`
                        }
                        aria-label="Email"
                    >
                        <i className="bi bi-envelope-fill"></i>
                    </a>

                </div>

            </div>

        </footer>
    );
}


export default Footer;