import axios from "axios";

const baseURL = "/api";

const api = axios.create({
    baseURL: baseURL,
});

export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp - now < 60; // sắp hết hạn trong 60 giây
    } catch {
        return true;
    }
}

api.interceptors.request.use(
    (config) => {
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

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            localStorage.clear();
            alert("Hết hạn token vui lòng đăng nhập lại");
            window.location.href = "./";
        }
        return Promise.reject(error);
    },
);

export default api;
