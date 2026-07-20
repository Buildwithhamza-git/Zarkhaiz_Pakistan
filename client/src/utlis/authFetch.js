const BASE_URL = "http://localhost:5000";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};