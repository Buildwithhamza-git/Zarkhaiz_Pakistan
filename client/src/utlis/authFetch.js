const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // ❗ Remove Content-Type if FormData
  if (isFormData) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("seller");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    throw data;
  }

  return data;
};
