const mockBookings = [
  {
    _id: "1",
    bookingCode: "BK000001",

    field: {
      fieldName: "Sân bóng đá 7 người A",
      image:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800",
      location: "Ninh Kiều, Cần Thơ",
    },

    bookingDate: "2026-08-10",

    startTime: "18:00",

    endTime: "20:00",

    totalPrice: 500000,

    paymentMethod: "Tiền mặt",

    status: "pending",
  },

  {
    _id: "2",
    bookingCode: "BK000002",

    field: {
      fieldName: "Sân bóng đá 5 người B",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c643e7485?w=800",
      location: "Ninh Kiều, Cần Thơ",
    },

    bookingDate: "2026-08-08",

    startTime: "19:00",

    endTime: "21:00",

    totalPrice: 400000,

    paymentMethod: "VNPay",

    status: "confirmed",
  },

  {
    _id: "3",
    bookingCode: "BK000003",

    field: {
      fieldName: "Sân Tennis A",
      image:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      location: "Cái Răng, Cần Thơ",
    },

    bookingDate: "2026-08-03",

    startTime: "07:00",

    endTime: "08:00",

    totalPrice: 250000,

    paymentMethod: "Tiền mặt",

    status: "cancelled",
  },

  {
    _id: "4",
    bookingCode: "BK000004",

    field: {
      fieldName: "Sân Pickleball 2",
      image:
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800",
      location: "Bình Thủy, Cần Thơ",
    },

    bookingDate: "2026-08-15",

    startTime: "16:00",

    endTime: "18:00",

    totalPrice: 600000,

    paymentMethod: "VNPay",

    status: "pending",
  },
];

export default mockBookings;