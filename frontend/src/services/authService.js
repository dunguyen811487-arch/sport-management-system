import API from "../config/api";

// ==========================================================
// LOGIN
// ==========================================================

export const login = async (
  phone,
  password
) => {

  const response =
    await API.post(
      "/auth/login",
      {
        phone,
        password,
      }
    );

  return response.data;
};

// ==========================================================
// REGISTER
// ==========================================================

export const register = async (
  data
) => {

  const response =
    await API.post(
      "/auth/register",
      {
        fullName:
          data.fullName,

        phone:
          data.phone,

        email:
          data.email,

        password:
          data.password,
      }
    );

  return response.data;
};

// ==========================================================
// PROFILE
// ==========================================================

export const getProfile =
  async () => {

    const response =
      await API.get(
        "/auth/profile"
      );

    return response.data;
  };