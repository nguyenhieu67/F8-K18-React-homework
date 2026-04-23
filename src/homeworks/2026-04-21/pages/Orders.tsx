/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography, Card } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import config from "../../../config";
import api from "../../2026-04-11/plugins/axios";
import type { Column, Customer, Order, Product } from "../../../utils/type";
import { Dialog, OrderDialog } from "../components";
import { getError, toastMsg } from "../../../utils/message";
import Table from "../../../components/Table";
import { formatPrice, getStatusColor } from "../../../utils/action";
import CardItem from "../components/CardItem";

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<Order | null>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isModelOpen1, setIsModelOpen1] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null);
    const [errors, setErrors] = useState<{
        productId?: number | string;
        customerId?: number | string;
    }>({});
    const [startValue, setStartValue] = useState<Dayjs | null>(
        dayjs().subtract(1, "month"),
    );
    const [endValue, setEndValue] = useState<Dayjs | null>(dayjs());
    const navigate = useNavigate();

    const orderForm: Order = {
        id: 0,
        productId: "",
        customerId: "",
        amount: "",
        status: "",
    };

    const [formData, setFormData] = useState(orderForm);

    const columns: Column[] = useMemo(() => {
        return [
            {
                value: "code",
                text: "Order Code",
                render: (order) => <strong>ORD-{order.id}</strong>,
            },
            {
                value: "customer",
                text: "Customers",
                render: (order) => {
                    return <p>{order?.customer?.name}</p>;
                },
            },
            {
                value: "product",
                text: "Products",
                render: (order) => order?.product?.name,
            },
            {
                value: "price",
                text: "Price",
                render: (order) => formatPrice(order?.product?.price),
            },
            {
                value: "amount",
                text: "Amount",
            },
            {
                value: "status",
                text: "Status",
                render: (order) => (
                    <p
                        className={`px-3 py-1 rounded-full font-bold w-fit ${getStatusColor(order.status)}`}
                    >
                        {order.status.toUpperCase()}
                    </p>
                ),
            },
            {
                value: "date",
                text: "Create date",
            },
            {
                value: "actions",
                text: "Action",
            },
        ];
    }, []);

    const orderValue = useMemo(() => {
        return orders.reduce(
            (acc, curr) => {
                const price = Number(curr.product?.price) || 0;
                const quantity = Number(curr.amount) || 0;

                if (curr.status === "done") {
                    acc.total += price * quantity;
                }
                return acc;
            },
            {
                length: orders.length,
                total: 0,
            } as any,
        );
    }, [orders]);

    const filterOrder = useMemo(() => {
        if (!startValue || !endValue) return orders;
        dayjs.extend(isBetween);

        return orders.filter((order) => {
            const orderDate = dayjs(order?.date as string);

            return orderDate.isBetween(startValue, endValue, "day", "[]");
        });
    }, [orders, startValue, endValue]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const [products, customers, orders] = await Promise.all([
                    api.get<Product[]>("/products"),
                    api.get<Customer[]>("/customers"),
                    api.get<Order[]>("/orders"),
                ]);

                setProducts(products as unknown as Product[]);
                setCustomers(customers as unknown as Customer[]);
                setOrders(orders as unknown as Order[]);
            } catch (error: unknown) {
                getError(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (selectedOrders) {
            const timer = setTimeout(() => {
                setFormData({
                    id: 0,
                    productId:
                        selectedOrders.productId ||
                        selectedOrders?.product?.id ||
                        "",
                    customerId:
                        selectedOrders.customerId ||
                        selectedOrders?.customer?.id ||
                        "",
                    amount: selectedOrders.amount || 1,
                    status: selectedOrders.status || "pending",
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [selectedOrders]);

    const handleModelOpen = () => {
        setSelectedOrders(null);
        setFormData(orderForm);
        setIsModelOpen(true);
        setErrors({});
    };

    const openConfirmDelete = useCallback(
        (id: number) => {
            const findP = orders.find((p) => p.id === id);
            setSelectedOrders(findP || null);
            setOrderIdToDelete(id);
            setIsConfirmDelete(true);
        },
        [orders],
    );

    const handleChangeForm = useCallback((newData: Order) => {
        if (newData.productId) {
            setErrors((prev) => ({ ...prev, productId: "" }));
        }
        if (newData.customerId) {
            setErrors((prev) => ({ ...prev, customerId: "" }));
        }

        setSelectedOrders(newData);
    }, []);

    const validateForm = useCallback(() => {
        const newErrors: {
            productId?: number | string;
            customerId?: number | string;
        } = {};

        if (!formData.productId) {
            newErrors.productId =
                "Please select one product; do not leave it blank.";
        }

        if (!formData.customerId) {
            newErrors.customerId =
                "Please select one customer; do not leave it blank.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handelEdit = useCallback(
        (id: number) => {
            const findO = orders.find((o) => o.id === id);
            setSelectedOrders(findO || null);
            setIsModelOpen(true);
            setErrors({});
        },
        [orders],
    );

    const handleDelete = useCallback(async () => {
        if (!orderIdToDelete) return;

        try {
            await api.delete(`/orders/${orderIdToDelete}`);
            setOrders((prev) =>
                prev.filter((item) => item.id !== orderIdToDelete),
            );
            toastMsg("Deleted successfully");
        } catch (error) {
            getError(error);
        } finally {
            setIsConfirmDelete(false);
            setOrderIdToDelete(null);
        }
    }, [orderIdToDelete]);

    const handleSubmit = useCallback(
        async (id: number) => {
            if (!validateForm()) return;

            try {
                let response: Order;

                if (id) {
                    response = (await api.put(`/orders/${id}`, {
                        ...formData,
                        amount: Number(formData.amount),
                    })) as Order;

                    setOrders((prev) =>
                        prev.map((item) => (item.id === id ? response : item)),
                    );
                    toastMsg("Updated successfully");
                } else {
                    response = (await api.post("/orders", {
                        ...formData,
                        amount: Number(formData.amount),
                    })) as Order;

                    setOrders((prev) => [response, ...prev]);
                    toastMsg("Created successfully");
                }
                setIsModelOpen(false);
                setSelectedOrders(null);
                setErrors({});
            } catch (error) {
                getError(error);
            }
        },
        [formData, validateForm],
    );

    const handleLogout = () => {
        if (!confirm("Are you sure logout")) return;

        localStorage.clear();
        navigate(config.routes.homework_44_login);
    };

    const handleResetDate = useCallback(() => {
        const newStart = dayjs().subtract(1, "month");
        const newEnd = dayjs();

        if (
            newStart.format("YYYY-MM-DD") !== startValue?.format("YYYY-MM-DD")
        ) {
            setStartValue(newStart);
        }

        if (newEnd.format("YYYY-MM-DD") !== endValue?.format("YYYY-MM-DD")) {
            setEndValue(newEnd);
        }
    }, [startValue, endValue]);

    // Test
    const handleTestReRender = () => {
        setIsModelOpen1(true);
    };

    return (
        <div>
            <nav className="flex gap-5 text-white mb-5">
                <button
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400 ml-auto"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress aria-label="Loading…" />
                </Box>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-6">
                        <Button
                            sx={{ marginRight: "auto" }}
                            variant="outlined"
                            onClick={handleTestReRender}
                        >
                            Test
                        </Button>
                        <button
                            className="bg-[#3498db] hover:opacity-90 text-white rounded-lg px-4 py-2 cursor-pointer"
                            onClick={handleModelOpen}
                        >
                            + Create order
                        </button>
                    </div>
                    <Dialog
                        title="Test re-render"
                        isOpen={isModelOpen1}
                        onClose={() => setIsModelOpen1(false)}
                    />

                    {/* Summary */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: 3,
                        }}
                    >
                        <CardItem borderColor="#0288d1">
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#888",
                                }}
                            >
                                Total Orders
                            </Typography>
                            <Typography>
                                <span className="font-bold text-2xl">
                                    {orderValue.length}
                                </span>{" "}
                                <small className="text-[#888]">Order</small>
                            </Typography>
                        </CardItem>
                        <CardItem borderColor="#27ae60">
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#888",
                                }}
                            >
                                Total Revenue (Done)
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#27ae60",
                                    fontWeight: "600",
                                    fontSize: 24,
                                }}
                            >
                                {formatPrice(orderValue.total)}
                            </Typography>
                        </CardItem>
                    </Box>

                    {/* Date */}
                    <Box>
                        <Card
                            sx={{
                                padding: 2,
                                borderRadius: "12px",
                                margin: "30px 0",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "24px",
                                    fontWeight: "600",
                                    marginBottom: 1,
                                }}
                            >
                                Filter by date
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={["DatePicker", "DatePicker"]}
                                >
                                    <DatePicker
                                        label="Start Date"
                                        value={startValue}
                                        onChange={(newValue) =>
                                            setStartValue(newValue)
                                        }
                                        disableFuture
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={endValue}
                                        onChange={(newValue) =>
                                            setEndValue(newValue)
                                        }
                                        disableFuture
                                    />

                                    <Button
                                        variant="outlined"
                                        onClick={handleResetDate}
                                    >
                                        Reset Date
                                    </Button>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Card>
                    </Box>

                    <Table
                        columns={columns}
                        rows={filterOrder}
                        onClickEdit={handelEdit}
                        onClickDelete={openConfirmDelete}
                    />
                </div>
            )}

            {/* Order */}
            <Dialog
                title={
                    selectedOrders?.id
                        ? `Edit order id: ${selectedOrders.id}`
                        : "Create order"
                }
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                onSubmit={() => handleSubmit(selectedOrders?.id || 0)}
            >
                <OrderDialog
                    order={selectedOrders}
                    products={products}
                    customers={customers}
                    validate={errors}
                    onChange={handleChangeForm}
                />
            </Dialog>

            <Dialog
                title={`Are you sure delete order is id: ${selectedOrders?.id || "order"}?`}
                isOpen={isConfirmDelete}
                onClose={() => setIsConfirmDelete(false)}
                onSubmit={handleDelete}
            ></Dialog>
        </div>
    );
}

export default Orders;
