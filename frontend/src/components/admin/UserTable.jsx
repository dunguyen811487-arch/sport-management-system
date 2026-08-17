function UserTable({
  users,
  onDelete,
  getRoleText,
  getRoleClass,
}) {
  return (
    <div className="card shadow-sm">

      <div className="card-header">

        <h5 className="mb-0">
          Danh sách tài khoản
        </h5>

      </div>

      <div className="card-body p-0">

        {users.length === 0 ? (

          <div className="text-center p-5">

            <i className="bi bi-people fs-1 text-muted"></i>

            <p className="text-muted mt-2 mb-0">
              Chưa có tài khoản nào
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Họ tên
                  </th>

                  <th>
                    Số điện thoại
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th className="text-center">
                    Thao tác
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user, index) => (

                  <tr
                    key={user.id || user._id || index}
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {
                          user.fullName ||
                          user.name ||
                          "Không có tên"
                        }
                      </strong>
                    </td>

                    <td>
                      {user.phone || "-"}
                    </td>

                    <td>
                      {user.email || "-"}
                    </td>

                    <td>

                      <span
                        className={`badge ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>

                    </td>

                    <td className="text-center">

                      {user.role?.toLowerCase() ===
                      "admin" ? (

                        <span className="text-muted">
                          Tài khoản hệ thống
                        </span>

                      ) : (

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            onDelete(user)
                          }
                        >

                          <i className="bi bi-trash-fill me-1"></i>

                          Xóa

                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default UserTable;