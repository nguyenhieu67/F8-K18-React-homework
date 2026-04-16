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
    async (config) => {
        let token = localStorage.getItem("access_token");

        if (token && isTokenExpired(token)) {
            console.log("Token sắp hết hạn, đang chủ động làm mới...");

            if (isRefreshing) {
                token = await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            } else {
                try {
                    isRefreshing = true;
                    const refreshToken = localStorage.getItem("refresh_token");

                    const { data } = await axios.post(
                        `${baseURL}/auth/refresh-token`,
                        {
                            refreshToken,
                        },
                    );

                    token = data.accessToken;
                    localStorage.setItem("access_token", data.accessToken);
                    localStorage.setItem("refresh_token", data.refreshToken);

                    processQueue(null, data.accessToken);
                } catch (error) {
                    processQueue(error, null);
                    localStorage.clear();
                    window.location.href = "/";
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            }
        }

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

export async function checkAuth() {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token && !refreshToken) {
        return false;
    }

    if (token && !isTokenExpired(token)) {
        return true;
    }

    console.log("CheckAuth: Token hết hạn, đang thử làm mới...");
    try {
        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken,
        });

        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);

        return true;
    } catch (error) {
        console.error("CheckAuth: Refresh thất bại", error);
        localStorage.clear();
        return false;
    }
}

export default api;
