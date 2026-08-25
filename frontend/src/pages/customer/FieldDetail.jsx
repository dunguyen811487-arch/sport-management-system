import { useState } from "react";

import formatCurrency from "../../utils/formatCurrency";

import "../../assets/styles/field-detail.css";


function FieldDetail({
    field,
    onClose,
    onBooking
}) {


    const [activeTab, setActiveTab] = useState("info");


    if (!field) return null;



    return (

    <div
        className="field-detail-overlay"
        onClick={onClose}
    >


        <div
            className="field-detail-drawer"
            onClick={(e) => e.stopPropagation()}
        >


                {/* Nút đóng */}

                <button
                    className="detail-close"
                    onClick={onClose}
                >
                    ✕
                </button>



                {/* Ảnh chính */}

                <img

                    src={field.image}

                    className="detail-main-image"

                    alt={field.fieldName}

                />




                <div className="detail-content">



                    <h2>
                        {field.fieldName}
                    </h2>



                    <div className="rating">

                        ⭐ {field.rating}/5

                    </div>




                    {/* TAB */}

                    <div className="detail-tabs">


                        <button

                            className={
                                activeTab === "info"
                                ? "active"
                                : ""
                            }

                            onClick={() =>
                                setActiveTab("info")
                            }

                        >

                            Tổng quan

                        </button>



                        <button

                            className={
                                activeTab === "service"
                                ? "active"
                                : ""
                            }

                            onClick={() =>
                                setActiveTab("service")
                            }

                        >

                            Dịch vụ

                        </button>




                        <button

                            className={
                                activeTab === "image"
                                ? "active"
                                : ""
                            }

                            onClick={() =>
                                setActiveTab("image")
                            }

                        >

                            Hình ảnh

                        </button>




                        <button

                            className={
                                activeTab === "rule"
                                ? "active"
                                : ""
                            }

                            onClick={() =>
                                setActiveTab("rule")
                            }

                        >

                            Điều khoản

                        </button>


                    </div>





                    {/* =====================
                        TAB THÔNG TIN
                    ====================== */}


                    {
                        activeTab === "info" && (

                            <div>


                                <h5>
                                    📍 Địa chỉ
                                </h5>

                                <p>
                                    {field.location}
                                </p>




                                <h5>
                                    📞 Liên hệ
                                </h5>

                                <p>
                                    0909 123 456
                                </p>





                                <h5>
                                    ⏰ Thời gian hoạt động
                                </h5>

                                <p>
                                    06:00 - 23:00 mỗi ngày
                                </p>





                                <h5>
                                    🏟️ Loại sân
                                </h5>

                                <p>
                                    {field.subType}
                                </p>





                                <h5>
                                    📝 Mô tả
                                </h5>

                                <p>
                                    {field.description}
                                </p>





                                <h5>
                                    💰 Giá tham khảo
                                </h5>


                                <p className="price">

                                    {
                                        formatCurrency(
                                            field.pricePerHour
                                        )
                                    }

                                    / giờ

                                </p>



                            </div>

                        )
                    }






                    {/* =====================
                        TAB DỊCH VỤ
                    ====================== */}



                    {
                        activeTab === "service" && (

                            <div>



                                <h5>
                                    🕒 Khung giờ & giá thuê
                                </h5>




                                <div className="service-card">


                                    <h5>
                                        Thứ 2 - Thứ 6
                                    </h5>


                                    <p>
                                        06:00 - 17:00
                                    </p>


                                    <p>
                                        Giá:
                                        {" "}
                                        150.000đ/giờ
                                    </p>


                                </div>






                                <div className="service-card">


                                    <h5>
                                        Thứ 2 - Thứ 6
                                    </h5>


                                    <p>
                                        17:00 - 23:00
                                    </p>


                                    <p>
                                        Giá:
                                        {" "}
                                        250.000đ/giờ
                                    </p>


                                </div>







                                <div className="service-card">


                                    <h5>
                                        Cuối tuần
                                    </h5>


                                    <p>
                                        06:00 - 23:00
                                    </p>


                                    <p>
                                        Giá:
                                        {" "}
                                        300.000đ/giờ
                                    </p>


                                </div>



                            </div>

                        )
                    }







                    {/* =====================
                        TAB HÌNH ẢNH
                    ====================== */}



                    {
                        activeTab === "image" && (

                            <div className="gallery">


                                <img

                                    src={field.image}

                                    alt="field"

                                />



                                <img

                                    src={field.image}

                                    alt="field"

                                />


                            </div>

                        )
                    }








                    {/* =====================
                        TAB ĐIỀU KHOẢN
                    ====================== */}



                    {
    activeTab === "rule" && (

        <div className="rules">


            <h5>
                ⭐ Cam kết chất lượng
            </h5>

            <ul>

                <li>
                    Sân được vệ sinh và kiểm tra trước mỗi lượt đặt.
                </li>

                <li>
                    Đảm bảo đúng loại sân, diện tích và tiêu chuẩn đã mô tả.
                </li>

                <li>
                    Hệ thống hỗ trợ khách hàng trong suốt quá trình sử dụng sân.
                </li>

                <li>
                    Trang thiết bị đi kèm được bảo trì định kỳ.
                </li>

            </ul>




            <h5>
                📅 Chính sách đặt sân
            </h5>


            <ul>

                <li>
                    Khách hàng cần đặt sân trước thời gian sử dụng tối thiểu 30 phút.
                </li>

                <li>
                    Một lượt đặt sân được giữ trong vòng 15 phút sau thời gian bắt đầu.
                </li>

                <li>
                    Vui lòng cung cấp thông tin chính xác khi đặt sân.
                </li>

                <li>
                    Không sử dụng sân cho mục đích trái quy định.
                </li>

            </ul>





            <h5>
                🔄 Chính sách đổi lịch / hủy sân
            </h5>


            <ul>

                <li>
                    Có thể đổi lịch trước giờ đặt ít nhất 3 giờ.
                </li>

                <li>
                    Hủy trước 24 giờ: hoàn lại 100% chi phí.
                </li>

                <li>
                    Hủy từ 3 - 24 giờ trước giờ đặt: hoàn lại 50% chi phí.
                </li>

                <li>
                    Hủy dưới 3 giờ hoặc không đến: không được hoàn tiền.
                </li>

            </ul>





            <h5>
                💳 Chính sách thanh toán
            </h5>


            <ul>

                <li>
                    Hỗ trợ thanh toán trực tiếp tại sân hoặc thanh toán online.
                </li>

                <li>
                    Giá thuê sân có thể thay đổi theo khung giờ cao điểm.
                </li>

                <li>
                    Mọi khoản phí phát sinh sẽ được thông báo trước khi thanh toán.
                </li>

            </ul>


        </div>

    )
}





                    {/* BUTTON ĐẶT SÂN */}


                    <button

                        className="booking-btn"

                        onClick={() =>
                            onBooking(field)
                        }

                    >

                        🏟️ Đặt sân ngay

                    </button>



                </div>


            </div>


        </div>

    );

}


export default FieldDetail;