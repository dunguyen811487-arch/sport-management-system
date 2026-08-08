function BookingFilter({

  currentFilter,

  onFilterChange,

}) {

  const filters = [

    {
      value: "all",
      label: "Tất cả",
    },

    {
      value: "pending",
      label: "Chờ xác nhận",
    },

    {
      value: "confirmed",
      label: "Đã xác nhận",
    },

    {
      value: "cancelled",
      label: "Đã hủy",
    },

  ];

  return (

    <div className="booking-filter mb-4">

      <div className="d-flex flex-wrap gap-2">

        {filters.map((item) => (

          <button
            key={item.value}
            className={`btn ${
              currentFilter === item.value
                ? "btn-success"
                : "btn-outline-success"
            }`}
            onClick={() =>
              onFilterChange(item.value)
            }
          >

            {item.label}

          </button>

        ))}

      </div>

    </div>

  );

}

export default BookingFilter;