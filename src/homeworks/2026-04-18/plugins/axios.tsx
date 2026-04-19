import axios from "axios";

const baseURL = "/api";

const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;
