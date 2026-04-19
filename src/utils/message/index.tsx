/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import axios from "axios";

export const getError = (error: any) => {
    let serverError = "Đã có lỗi xảy ra!";
    if (axios.isAxiosError(error)) {
        serverError =
            error.response?.data?.message || error.message || serverError;
    } else if (error instanceof Error) {
        serverError = error.message;
    }
    if (error.response?.status === 403) {
        toast.error(
            "I apologize, the server is experiencing an error, please login again.",
        );
        return;
    }

    toast.error(serverError);
};

export const toastMsg = (msg: string) => {
    toast.success(msg);
};
