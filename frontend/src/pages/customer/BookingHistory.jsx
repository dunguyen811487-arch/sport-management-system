import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import mockBookings from "../../mock/bookings";

import BookingCard from "../../components/customer/BookingCard";
import BookingFilter from "../../components/customer/BookingFilter";
import EmptyBooking from "../../components/customer/EmptyBooking";

import useAuth from "../../hooks/useAuth";

import "../../assets/styles/booking-history.css";

function BookingHistory() {

  // =============================
  // Auth
  // =============================

  const { user } = useAuth();

  // =============================
  // Location
  // =============================

  const location = useLocation();

  // =============================
  // State
  // =============================

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [bookings, setBookings] = useState(() => {

    const saved =
      localStorage.getItem("bookings");

    if (saved) {

      try {

        const parsed =
          JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed
          : [];

      } catch (error) {

        console.error(
          "Không thể đọc bookings:",
          error
        );

        return [];
      }
    }

    return mockBookings;
  });

  // =============================
  // Đọc lại bookings
  // =============================

  useEffect(() => {

    const saved =
      localStorage.getItem("bookings");

    if (saved) {

      try {

        const parsed =
          JSON.parse(saved);

        setBookings(
          Array.isArray(parsed)
            ? parsed
            : []
        );

      } catch (error) {

        console.error(
          "Không thể đọc bookings:",
          error
        );

        setBookings([]);

      }

    } else {

      setBookings(mockBookings);

    }

  }, [location]);

  // =============================
  // Lọc booking theo user
  // =============================

  const userBookings = useMemo(() => {

    if (!user) {
      return [];
    }

    return bookings.filter(
      (booking) => {

        // =============================
        // Booking mới
        // Có userId
        // =============================

        if (
          booking.userId !== undefined &&
          booking.userId !== null
        ) {

          return (
            String(booking.userId) ===
            String(user.id)
          );

        }

        // =============================
        // Booking cũ
        // Fallback phone
        // =============================

        return (
          booking.user?.phone ===
          user.phone
        );

      }
    );

  }, [bookings, user]);

  // =============================
  // Gửi yêu cầu hủy
  // =============================

  const handleCancel = (bookingCode) => {

    if (!user) {

      alert(
        "Vui lòng đăng nhập để thực hiện thao tác này."
      );

      return;
    }

    // =============================
    // Tìm booking
    // =============================

    const targetBooking =
      bookings.find(
        (booking) => {

          const isOwner =
            booking.userId !== undefined &&
            booking.userId !== null
              ? String(booking.userId) ===
                String(user.id)
              : booking.user?.phone ===
                user.phone;

          return (
            booking.bookingCode ===
              bookingCode &&
            isOwner
          );

        }
      );

    // =============================
    // Không tìm thấy
    // =============================

    if (!targetBooking) {

      alert(
        "Không tìm thấy đơn đặt sân."
      );

      return;
    }

    // =============================
    // Kiểm tra trạng thái
    // =============================

    if (
      targetBooking.status ===
      "cancel_requested"
    ) {

      alert(
        "Đơn này đã gửi yêu cầu hủy và đang chờ nhân viên xác nhận."
      );

      return;
    }

    if (
      targetBooking.status ===
      "cancelled"
    ) {

      alert(
        "Đơn này đã được hủy."
      );

      return;
    }

    if (
      targetBooking.status !==
      "pending"
    ) {

      alert(
        "Đơn đã được xác nhận nên không thể yêu cầu hủy theo quy trình hiện tại."
      );

      return;
    }

    // =============================
    // Xác nhận
    // =============================

    const confirmCancel =
      window.confirm(
        "Bạn có chắc muốn gửi yêu cầu hủy đơn này?\n\nĐơn sẽ không bị hủy ngay. Nhân viên cần xác nhận yêu cầu."
      );

    if (!confirmCancel) {
      return;
    }

    // =============================
    // Cập nhật booking
    // =============================

    const updatedBookings =
      bookings.map(
        (booking) => {

          const isOwner =
            booking.userId !== undefined &&
            booking.userId !== null
              ? String(booking.userId) ===
                String(user.id)
              : booking.user?.phone ===
                user.phone;

          if (
            booking.bookingCode ===
              bookingCode &&
            isOwner &&
            booking.status ===
              "pending"
          ) {

            return {
              ...booking,

              status:
                "cancel_requested",

              cancelRequestedAt:
                new Date().toISOString(),

              cancelRequestedBy:
                user.id,

              cancelConfirmedAt:
                null,
            };

          }

          return booking;

        }
      );

    // =============================
    // State
    // =============================

    setBookings(
      updatedBookings
    );

    // =============================
    // LocalStorage
    // =============================

    localStorage.setItem(
      "bookings",
      JSON.stringify(
        updatedBookings
      )
    );

    // =============================
    // Thông báo
    // =============================

    alert(
      "Đã gửi yêu cầu hủy đơn. Vui lòng chờ nhân viên xác nhận."
    );

  };

  // =============================
  // Search + Filter
  // =============================

  const filteredBookings =
    useMemo(() => {

      return userBookings.filter(
        (booking) => {

          // =============================
          // Search
          // =============================

          const matchSearch =
            booking.bookingCode
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          // =============================
          // Filter
          // =============================

          const matchFilter =
            filter === "all"
              ? true
              : booking.status ===
                filter;

          return (
            matchSearch &&
            matchFilter
          );

        }
      );

    }, [
      userBookings,
      search,
      filter,
    ]);

  // =============================
  // Render
  // =============================

  return (

    <div>

      {/* =============================
          Header
      ============================= */}

      <div className="mb-4">

        <h2 className="fw-bold text-success">
          Lịch sử đặt sân
        </h2>

        <p className="text-muted">
          Theo dõi các lần đặt sân của bạn.
        </p>

      </div>

      {/* =============================
          Search
      ============================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo mã đặt sân..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =============================
          Filter
      ============================= */}

      <BookingFilter
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      {/* =============================
          Danh sách
      ============================= */}

      {filteredBookings.length === 0 ? (

        <EmptyBooking />

      ) : (

        filteredBookings.map(
          (booking) => (

            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={
                handleCancel
              }
            />

          )
        )

      )}

    </div>

  );
}

export default BookingHistory;