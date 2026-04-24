/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Autocomplete, TextField } from "@mui/material";

import config from "../../../config";
import type { Column, Customer } from "../../../utils/type";
import { Dialog, CustomerDialog } from "../components";
import { fetchApi } from "../../../utils/api";
import { getError, toastMsg } from "../../../utils/message";
import Table from "../../../components/Table";
import { formatAndMaskPhone } from "../../../utils/action";

function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );
    const [selectedRank, setSelectedRank] = useState<any>("");
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const navigate = useNavigate();

    const customerForm: Customer = {
        id: 0,
        name: "",
        email: "",
        phone: "",
        address: "",
        rank: "",
    };

    const [formData, setFormData] = useState(customerForm);

    const columns: Column[] = [
        {
            value: "customer",
            text: "Customer",
            render: (customer: Customer) => (
                <div className="flex items-center gap-2">
                    <div className=" shrink-0">
                        <img
                            src={`https://picsum.photos/200?random=${customer.id}`}
                            alt={customer.name}
                            className="w-10 h-10 object-cover rounded-full"
                        />
                    </div>
                    <div>
                        <strong>{customer.name}</strong>
                        <br />
                        <small>ID:{customer.id}</small>
                    </div>
                </div>
            ),
        },
        {
            value: "contact",
            text: "Contact",
            render: (customer: Customer) => {
                const phone = customer.phone;

                return (
                    <div>
                        {customer.email}
                        <br />
                        <small>{formatAndMaskPhone(phone as string)}</small>
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
            render: (customer: Customer) =>
                (customer.totalSpending || 0) as React.ReactNode,
        },
        {
            value: "actions",
            text: "Action",
        },
    ];

    const rankList = [
        {
            id: 1,
            rank: "GOLD",
        },
        {
            id: 2,
            rank: "SILVER",
        },
        {
            id: 3,
            rank: "BRONZE",
        },
    ];

    const filterCustomers =
        selectedRank === ""
            ? customers
            : customers.filter((c) => c.rank === selectedRank);

    const rankOptions = rankList.reduce((acc, curr) => {
        const isExisted = acc.find((item: any) => item.id === curr.id);
        if (!isExisted) {
            return [...acc, curr.rank];
        }
        return acc;
    }, [] as any);

    useEffect(() => {
        const getCustomers = async () => {
            setLoading(true);
            try {
                const res = (await fetchApi.get(
                    "/customers",
                )) as unknown as Customer[];
                setCustomers(res);
            } catch (error: unknown) {
                getError(error);
            } finally {
                setLoading(false);
            }
        };
        getCustomers();
    }, []);

    useEffect(() => {
        if (selectedCustomer) {
            const timer = setTimeout(() => {
                setFormData({
                    id: 0,
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

    const handleModelOpen = () => {
        setSelectedCustomer(null);
        setFormData(customerForm);
        setIsModelOpen(true);
        setErrors({});
    };

    const openConfirmDelete = (id: number) => {
        const findC = customers.find((c) => c.id === id);
        setSelectedCustomer(findC || null);
        setCustomerIdToDelete(id);
        setIsConfirmDelete(true);
    };

    const handleChangeForm = (newData: Customer) => {
        if (newData.name) {
            setErrors((prev) => ({ ...prev, name: "" }));
        }
        if (newData.email) {
            setErrors((prev) => ({ ...prev, email: "" }));
        }

        setSelectedCustomer(newData);
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

    const handelEdit = (id: number) => {
        const findC = customers.find((c) => c.id === id);
        setSelectedCustomer(findC || null);
        setIsModelOpen(true);
        setErrors({});
    };

    const handleDelete = async () => {
        if (!customerIdToDelete) return;

        try {
            await fetchApi.delete(`/customers/${customerIdToDelete}`);
            setCustomers((prev) =>
                prev.filter((item) => item.id !== customerIdToDelete),
            );
            toastMsg("Deleted successfully");
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

    const handleSubmit = async (id: number) => {
        if (!validateForm()) return;

        try {
            let response: Customer;

            if (id) {
                response = (await fetchApi.put(`/customers/${id}`, {
                    ...formData,
                })) as Customer;

                setCustomers((prev) =>
                    prev.map((item) => (item.id === id ? response : item)),
                );
                toastMsg("Updated successfully");
            } else {
                response = (await fetchApi.post("/customers", {
                    ...formData,
                    rank: formData.rank || "BRONZE",
                })) as Customer;

                setCustomers((prev) => [response, ...prev]);
                toastMsg("Created successfully");
            }
            setIsModelOpen(false);
            setSelectedCustomer(null);
            setErrors({});
        } catch (error) {
            getError(error);
        }
    };

    const handleLogout = () => {
        if (!confirm("Are you sure logout")) return;

        localStorage.clear();
        navigate(config.routes.homework_43_login);
    };

    return (
        <div>
            <nav className="flex gap-5 text-white mb-5">
                <NavLink
                    to={config.routes.homework_43_customers}
                    className="p-2 bg-blue-400 rounded-lg cursor-pointer hover:bg-blue-400"
                >
                    Customers
                </NavLink>
                <NavLink
                    to={config.routes.homework_43_products}
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400"
                >
                    Products
                </NavLink>
                <button
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400 ml-auto"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-6">
                        <button
                            className="bg-[#3498db] hover:opacity-90 text-white rounded-lg px-4 py-2 cursor-pointer"
                            onClick={handleModelOpen}
                        >
                            + Create customer
                        </button>
                    </div>

                    <Autocomplete
                        sx={{ width: 200, marginLeft: "auto" }}
                        options={rankOptions}
                        getOptionLabel={(option) => option || ""}
                        value={
                            rankOptions.find(
                                (c: string) => c === selectedRank,
                            ) || null
                        }
                        // check id
                        // getOptionKey={(option) => option}
                        // check curr id
                        // isOptionEqualToValue={(option, value) =>
                        //     option === value
                        // }
                        onChange={(_, newValue) =>
                            setSelectedRank(newValue ? newValue : "")
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Rank" />
                        )}
                    />
                    <Table
                        columns={columns}
                        rows={filterCustomers}
                        onClickEdit={handelEdit}
                        onClickDelete={openConfirmDelete}
                    />
                </div>
            )}

            {/* Customer */}
            <Dialog
                title={
                    selectedCustomer?.id
                        ? `Edit customer name: ${selectedCustomer.name}`
                        : "Create customer"
                }
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                onSubmit={() => handleSubmit(selectedCustomer?.id || 0)}
            >
                <CustomerDialog
                    customer={selectedCustomer}
                    validate={errors}
                    onChange={handleChangeForm}
                />
            </Dialog>
            <Dialog
                title={`Are you sure delete customer is name: ${selectedCustomer?.name || "customer"}?`}
                isOpen={isConfirmDelete}
                onClose={() => setIsConfirmDelete(false)}
                onSubmit={handleDelete}
            ></Dialog>
        </div>
    );
}

export default Customers;
