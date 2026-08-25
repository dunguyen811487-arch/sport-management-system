    function ErrorMessage({
  message = "Đã xảy ra lỗi!",
}) {
  return (
    <div className="alert alert-danger">

      <i className="bi bi-exclamation-triangle-fill me-2"></i>

      {message}

    </div>
  );
}

export default ErrorMessage;