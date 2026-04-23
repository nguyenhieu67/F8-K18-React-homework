import Table from "../../../components/Table";
import type { Column } from "../../../utils/type";

const productNames = [
    "Quần áo",
    "Giày dép",
    "Điện thoại",
    "Laptop",
    "Tai nghe",
    "Balo",
];

const customerNames = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Thị D",
    "Hoàng Văn E",
    "Vũ Thị F",
    "Đặng Văn G",
    "Bùi Thị H",
    "Đỗ Văn I",
    "Phan Thị K",
];

const tmpOrders = Array.from({ length: 1000 }, (_, i) => {
    const randomDate = new Date(
        2026,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
    );

    return {
        id: i + 1,
        customerName:
            customerNames[Math.floor(Math.random() * customerNames.length)],
        productName:
            productNames[Math.floor(Math.random() * productNames.length)],
        price: Math.floor(Math.random() * 5000000) + 100000, // 100k -> 5tr
        orderDate: randomDate.toISOString().split("T")[0],
        quantity: Math.floor(Math.random() * 10) + 1,
    };
});

const columns: Column[] = [
    { text: "Mã đơn", value: "id" },
    { text: "Tên khách hàng", value: "customerName" },
    { text: "Tên sản phẩm", value: "productName" },
    { text: "Giá", value: "price" },
    { text: "Ngày đặt hàng", value: "orderDate" },
    { text: "Số lượng", value: "quantity" },
];

const orders = tmpOrders;

function Test() {
    return (
        <div>
            <Table columns={columns} rows={orders} />
        </div>
    );
}

export default Test;
