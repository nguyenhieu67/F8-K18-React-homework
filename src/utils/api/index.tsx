/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../homeworks/2026-04-18/plugins/axios";

interface ApiI {
    get: <T>(endpoint: string) => Promise<T | null>;
    post: <T>(endpoint: string, body: any) => Promise<T | null>;
    put: <T>(endpoint: string, body: any) => Promise<T | null>;
    delete: <T>(endpoint: string) => Promise<T | null>;
}

class Api implements ApiI {
    private async getNewToken() {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) return;

        try {
            const { data } = await axios.post(
                "https://k305jhbh09.execute-api.ap-southeast-1.amazonaws.com/auth/refresh-token",
                {
                    refreshToken,
                },
            );
            const { accessToken } = data;
            localStorage.setItem("access_token", accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    private async request<T>(
        method: string,
        endpointL: string,
        body?: any,
    ): Promise<T | null> {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { data } = await api[method](endpointL, body);
            return data;
        } catch (e: any) {
            if (e.response?.data?.message === "token expired") {
                await this.getNewToken();
            }
            toast.warning(
                "The page is reloading because of a token expired!!!",
            );
            toast("request failed");

            if (e.response.data === "") {
                window.location.href =
                    "/F8-K18-React-homework/homework_43/login";

                return null;
            }
            window.location.reload();
            return null;
        }
    }

    async get<T>(endpoint: string): Promise<T | null> {
        return await this.request<T>("get", endpoint);
    }

    async post<T>(endpoint: string, body: any): Promise<T | null> {
        return await this.request<T>("post", endpoint, body);
    }

    async put<T>(endpoint: string, body: any): Promise<T | null> {
        return await this.request<T>("put", endpoint, body);
    }

    async delete<T>(endpoint: string): Promise<T | null> {
        return await this.request<T>("delete", endpoint);
    }
}

export const fetchApi = new Api();
