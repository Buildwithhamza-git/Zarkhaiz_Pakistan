const BASE_URL = "http://localhost:5000";

export const authFetch = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers && typeof options.headers === "object" ? options.headers : {}),
  };

  const isFormData = options.body instanceof FormData;

  if (isFormData) {
    delete headers["Content-Type"];
  } else if (options.body !== undefined && options.body !== null) {
    if (typeof options.body === "object" && !(options.body instanceof String) && !(options.body instanceof ArrayBuffer)) {
      options.body = JSON.stringify(options.body);
    }
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch (err) {
    data = await response.text();
  }

  if (!response.ok) {
    throw data || { message: response.statusText || "Request failed" };
  }

  return data;
};