import axios from "axios";

const baseURL = "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com";

const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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

async function getValidToken(): Promise<string | null> {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token || !refreshToken) return null;

    if (!isTokenExpired(token)) return token;

    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
                refreshToken,
            });

            const newToken = data.accessToken;
            localStorage.setItem("access_token", newToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            return newToken;
        } catch (e) {
            localStorage.clear();
            window.location.href = "./";
            console.error(e);
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

api.interceptors.request.use(async (config) => {
    const token = await getValidToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = await getValidToken();
            if (token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    },
);

export async function checkAuth() {
    const token = await getValidToken();
    return !!token;
}

export default api;
