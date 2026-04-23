/* eslint-disable @typescript-eslint/no-explicit-any */
export function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
        case "DELIVERING":
            return "delivering";
        case "DONE":
            return "done";
        case "PENDING":
            return "pending";
        case "CANCEL":
            return "cancel";
        default:
            return "#ccc";
    }
}

export function formatPrice(price: number) {
    return Number(price).toLocaleString("vi-VN") + "đ";
}

export function formatAndMaskPhone(phone: string) {
    if (!phone || phone.length < 10) return phone;
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.xxx");
}
