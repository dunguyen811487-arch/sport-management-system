import apiClient from "./apiClient";


export const getFieldTypesApi =
  () =>
    apiClient(
      "/field-types"
    );


export const getFieldTypeApi =
  (id) =>
    apiClient(
      `/field-types/${id}`
    );


export const createFieldTypeApi =
  (data) =>
    apiClient(
      "/field-types",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );


export const updateFieldTypeApi =
  (id, data) =>
    apiClient(
      `/field-types/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );


export const deleteFieldTypeApi =
  (id) =>
    apiClient(
      `/field-types/${id}`,
      {
        method: "DELETE",
      }
    );