import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
} from "@mui/material";

import api from "./plugins/axios";
import type { Column, Customer } from "../utils/type";
import TableComp from "./Table";
import DialogComp from "./Dialog";

interface Props {
    onLoginFail: () => void;
}

function Customers({ onLoginFail }: Props) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(
        null,
    );

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        rank: "",
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const [loading, setLoading] = useState(false);

    const toastify = (msg: string) => {
        toast.success(msg);
    };

    const getError = (error: unknown) => {
        let serverError = "Đã có lỗi xảy ra!";
        if (axios.isAxiosError(error)) {
            serverError =
                error.response?.data?.message || error.message || serverError;
        } else if (error instanceof Error) {
            serverError = error.message;
        }

        toast.error(serverError);
    };

    const columns: Column[] = [
        {
            value: "customer",
            text: "Customer",

            render: (customer: Customer) => (
                <div>
                    <strong>{customer.name}</strong>
                    <br />
                    <small>ID:{customer.id}</small>
                </div>
            ),
        },
        {
            value: "contact",
            text: "Contact",
            render: (customer: Customer) => {
                const phone = customer.phone;
                if (phone?.length === 10) {
                    return (
                        <div>
                            {customer.email}
                            <br />
                            <small>
                                {phone.slice(0, 4)}.{phone.slice(4, 7)}
                                .xxx
                            </small>
                        </div>
                    );
                }
                return (
                    <div>
                        {customer.email}
                        <br />
                        <small>{phone}</small>
                    </div>
                );
            },
        },
        {
            value: "rank",
            text: "Rank",
        },
        {
            value: "address",
            text: "Address",
        },
        {
            value: "totalSpending",
            text: "Total spending",
            render: (customer: Customer) => customer.totalSpending || 0,
        },
        {
            value: "actions",
            text: "Action",
        },
    ];

    useEffect(() => {
        if (selectedCustomer) {
            const timer = setTimeout(() => {
                setFormData({
                    name: selectedCustomer.name || "",
                    email: selectedCustomer.email || "",
                    phone: selectedCustomer.phone || "",
                    address: selectedCustomer.address || "",
                    rank: selectedCustomer.rank || "",
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [selectedCustomer]);

    useEffect(() => {
        const getCustomers = async () => {
            setLoading(true);
            try {
                const res = (await api.get(
                    "/customers",
                )) as unknown as Customer[];
                setCustomers(res);
            } catch (error: any) {
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    onLoginFail();
                } else {
                    getError(error);
                }
            } finally {
                setLoading(false);
            }
        };
        getCustomers();
    }, [onLoginFail]);

    const handleModelOpen = () => {
        setSelectedCustomer(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            rank: "",
        });
        setIsModelOpen(true);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: { email?: string; name?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "The name cannot be left blank.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email address cannot be left blank.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Email is not in the correct format.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (id: number) => {
        if (!validateForm()) return;

        try {
            let response: Customer;

            if (id) {
                response = await api.put(`/customers/${id}`, { ...formData });

                setCustomers((prev) =>
                    prev.map((item) => (item.id === id ? response : item)),
                );
                toastify("Updated successfully");
            } else {
                response = await api.post("/customers", {
                    ...formData,
                    phone: formData.phone.trim() || "",
                    address: formData.address.trim() || "",
                    rank: formData.rank || "BRONZE",
                });

                setCustomers((prev) => [response, ...prev]);
                toastify("Created successfully");
            }
            setIsModelOpen(false);
            setSelectedCustomer(null);
            setErrors({});
        } catch (error) {
            getError(error);
        }
    };

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | { target: { name?: string; value: unknown } },
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handelEdit = (id: number) => {
        const findC = customers.find((c) => c.id === id);
        setSelectedCustomer(findC || null);
        setIsModelOpen(true);
        setErrors({});
    };

    const openConfirmDelete = (id: number) => {
        const findC = customers.find((c) => c.id === id);
        setSelectedCustomer(findC || null);
        setCustomerIdToDelete(id);
        setIsConfirmDelete(true);
    };

    const handleDelete = async () => {
        if (!customerIdToDelete) return;

        try {
            await api.delete(`/customers/${customerIdToDelete}`);
            setCustomers((prev) =>
                prev.filter((item) => item.id !== customerIdToDelete),
            );
            toastify("Deleted successfully");
        } catch (error) {
            alert(
                "Vì khách hàng đang có order nên không thể xóa khách hàng được!!!",
            );
            getError(error);
        } finally {
            setIsConfirmDelete(false);
            setCustomerIdToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-end items-center mb-6">
                <button
                    className="bg-[#3498db] hover:opacity-90 text-white rounded-lg px-4 py-2 cursor-pointer"
                    onClick={handleModelOpen}
                >
                    + Create customer
                </button>
            </div>
            <ToastContainer />
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress aria-label="Loading…" />
                </Box>
            ) : (
                <TableComp
                    columns={columns}
                    rows={customers}
                    onClickEdit={handelEdit}
                    onClickDelete={openConfirmDelete}
                />
            )}

            <DialogComp
                title={
                    selectedCustomer
                        ? `Edit customer name: ${selectedCustomer.name}`
                        : "Create customer"
                }
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                onSubmit={() => handleSubmit(selectedCustomer?.id || 0)}
            >
                <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
                <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData?.phone}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData?.address}
                    onChange={handleChange}
                />
                <FormControl margin="dense" sx={{ width: "30%" }}>
                    <InputLabel id="rank">Rank</InputLabel>
                    <Select
                        label="Rank"
                        labelId="rank"
                        name="rank"
                        value={formData?.rank}
                        onChange={handleChange}
                    >
                        <MenuItem value="GOLD">Gold</MenuItem>
                        <MenuItem value="SILVER">Silver</MenuItem>
                        <MenuItem value="BRONZE">Bronze</MenuItem>
                    </Select>
                </FormControl>
            </DialogComp>

            <DialogComp
                title={`Are you sure delete ${selectedCustomer?.name || "customer"}?`}
                isOpen={isConfirmDelete}
                onClose={() => setIsConfirmDelete(false)}
                onSubmit={handleDelete}
            ></DialogComp>
        </div>
    );
}

export default Customers;
