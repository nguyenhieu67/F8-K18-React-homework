import axios from "axios";

const baseURL = "/api";

const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export function isTokenExpired(token: string | null) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp - now < 10;
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
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (
            !error.response ||
            (error.response.status !== 401 && error.response.status !== 403)
        ) {
            return Promise.reject(error);
        }

        if (originalRequest.url.includes("/auth/refresh-token")) {
            localStorage.clear();
            window.location.href = "./";
            return Promise.reject(error);
        }

        if (!originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] =
                            `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const refreshToken = localStorage.getItem("refresh_token");

                    const response = await api.post(`/auth/refresh-token`, {
                        refreshToken,
                    });

                    if (response.status === 200) {
                        const { accessToken, refreshToken: newRefreshToken } =
                            response.data;
                        localStorage.setItem("access_token", accessToken);
                        localStorage.setItem("refresh_token", newRefreshToken);

                        originalRequest.headers["Authorization"] =
                            `Bearer ${accessToken}`;

                        processQueue(null, accessToken);
                        resolve(api(originalRequest));
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.clear();
                    window.location.href = "./";
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        return Promise.reject(error);
    },
);

export default api;
