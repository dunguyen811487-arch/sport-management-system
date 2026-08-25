function AdminStatCard({
  title,
  value,
  icon,
  description,
  loading = false,
}) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start">

          <div>

            <p className="text-muted mb-2">
              {title}
            </p>

            {loading ? (
              <div
                className="placeholder-glow"
                style={{ width: "100px" }}
              >
                <span className="placeholder col-12"></span>
              </div>
            ) : (
              <h2 className="fw-bold mb-1">
                {value}
              </h2>
            )}

            {description && (
              <small className="text-muted">
                {description}
              </small>
            )}

          </div>

          <div
            className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
            style={{
              width: "50px",
              height: "50px",
            }}
          >
            <i
              className={`bi ${icon} fs-4`}
            ></i>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminStatCard;