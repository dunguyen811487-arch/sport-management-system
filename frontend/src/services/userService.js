
// src/services/userService.js

/*
 * ============================================================
 * USER SERVICE
 * ============================================================
 *
 * Đây là tầng trung gian giữa UI và dữ liệu User.
 *
 * HIỆN TẠI:
 *   Frontend chưa có Backend nên tạm thời sử dụng localStorage.
 *
 * SAU NÀY:
 *   Chỉ cần thay phần implementation bằng Axios/API.
 *
 * API Backend dự kiến:
 *
 * GET    /api/users
 * POST   /api/users
 * DELETE /api/users/:id
 *
 * Base URL:
 * http://localhost:5000/api
 *
 * ============================================================
 */


// ============================================================
// LOCAL STORAGE KEY
// ============================================================

const USERS_STORAGE_KEY = "users";


// ============================================================
// HELPER
// ============================================================

const getStoredUsers = () => {
  try {
    const savedUsers =
      localStorage.getItem(
        USERS_STORAGE_KEY
      );

    if (!savedUsers) {
      return [];
    }

    const parsedUsers =
      JSON.parse(savedUsers);

    return Array.isArray(parsedUsers)
      ? parsedUsers
      : [];

  } catch (error) {

    console.error(
      "userService: Không thể đọc users:",
      error
    );

    return [];
  }
};


const saveStoredUsers = (users) => {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users)
  );
};


// ============================================================
// GET USERS
// ============================================================

export const getUsers = async () => {

  /*
   * Sau này thay phần này bằng:
   *
   * const response = await axios.get("/users");
   * return response.data;
   */

  return getStoredUsers();
};


// ============================================================
// CREATE STAFF
// ============================================================

export const createStaff = async (
  staffData
) => {

  const users =
    getStoredUsers();


  // ----------------------------------------------------------
  // Kiểm tra số điện thoại
  // ----------------------------------------------------------

  const existingUser =
    users.find(
      (user) =>
        user.phone ===
        staffData.phone
    );


  if (existingUser) {

    throw new Error(
      "Số điện thoại này đã được sử dụng!"
    );
  }


  // ----------------------------------------------------------
  // Tạo Staff
  // ----------------------------------------------------------

  const newStaff = {

    id: `staff_${Date.now()}`,

    fullName:
      staffData.fullName.trim(),

    name:
      staffData.fullName.trim(),

    phone:
      staffData.phone,

    password:
      staffData.password,

    email:
      staffData.email?.trim() || "",

    gender:
      staffData.gender || "",

    dateOfBirth:
      staffData.dateOfBirth || "",

    address:
      staffData.address?.trim() || "",

    // QUAN TRỌNG
    role: "staff",

  };


  // ----------------------------------------------------------
  // Save
  // ----------------------------------------------------------

  const newUsers = [
    ...users,
    newStaff,
  ];


  saveStoredUsers(
    newUsers
  );


  return newStaff;
};


// ============================================================
// DELETE USER
// ============================================================

export const deleteUser = async (
  userId
) => {

  const users =
    getStoredUsers();


  const newUsers =
    users.filter(
      (user) =>
        user.id !== userId &&
        user._id !== userId
    );


  saveStoredUsers(
    newUsers
  );


  return newUsers;
};


// ============================================================
// GET USER BY ID
// ============================================================

export const getUserById = async (
  userId
) => {

  const users =
    getStoredUsers();


  return users.find(
    (user) =>
      user.id === userId ||
      user._id === userId
  );
};

