import apiClient from "./apiClient";


// CUSTOMER

export const createPaymentApi =
  (data) =>
    apiClient(
      "/payments",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );


// CUSTOMER

export const getMyPaymentsApi =
  () =>
    apiClient(
      "/payments/my"
    );


// STAFF + ADMIN

export const getPaymentsApi =
  () =>
    apiClient(
      "/payments"
    );


// CUSTOMER + STAFF + ADMIN

export const getPaymentApi =
  (id) =>
    apiClient(
      `/payments/${id}`
    );


// STAFF + ADMIN

export const updatePaymentApi =
  (id, data) =>
    apiClient(
      `/payments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );


// ADMIN

export const deletePaymentApi =
  (id) =>
    apiClient(
      `/payments/${id}`,
      {
        method: "DELETE",
      }
    );