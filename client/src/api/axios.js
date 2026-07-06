import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 15000,
    withCredentials: true,
    transformRequest: [(data) => {
        if (data === undefined || data === null) {
            return data;
        }

        if (typeof data === "string") {
            return data;
        }

        return JSON.stringify(data);
    }],
});

export default api;