import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import api, { isTokenExpired } from "./plugins/axios";
import Table from "./Table";
import Dialog from "./Dialog";

function Customers({ onLoginFail }) {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        rank: "",
    });
    const [errors, setErrors] = useState({});

    const toastify = (msg) => {
        toast.success(msg);
    };

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
        const token = localStorage.getItem("access_token");
        if (isTokenExpired(token)) {
            alert("Vui lòng đăng nhập trước");
            if (onLoginFail) onLoginFail();
            return;
        }

        const getCustomers = async () => {
            try {
                const res = await api.get("/customers");
                setCustomers(res);
            } catch (error) {
                const serverError =
                    error.response?.data?.message || "Erroring!";
                toast.error(serverError);
            }
        };
        toastify("Login successful");
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
        let newErrors = {};

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

    const handleSubmit = async (id) => {
        if (!validateForm()) return;

        try {
            let response;

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
            const serverError = error.response?.data?.message || "Erroring!";
            toast.error(serverError);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handelEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsModelOpen(true);
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;

        try {
            await api.delete(`/customers/${id}`);
            setCustomers((prev) => prev.filter((item) => item.id !== id));
            toastify("Deleted successfully");
        } catch (error) {
            alert(
                "Vì khách hàng đang có order nên không thể xóa khách hàng được!!!",
            );
            const serverError = error.response?.data?.message || "Erroring!";
            toast.error(serverError);
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
            <Table
                customersData={customers}
                onEdit={handelEdit}
                onDelete={handleDelete}
            />
            <Dialog
                isOpen={isModelOpen}
                title={
                    selectedCustomer
                        ? `Edit customer name: ${selectedCustomer.name}`
                        : "Create customer"
                }
                onClose={() => setIsModelOpen(false)}
                onSubmit={() => handleSubmit(selectedCustomer?.id)}
            >
                <form className="flex flex-col gap-4 w-[80%]">
                    <div>
                        <label htmlFor="name" className="font-bold">
                            Name:
                        </label>
                        <input
                            name="name"
                            id="name"
                            value={formData.name}
                            placeholder="Name..."
                            className="block border p-1 px-3 rounded-md mt-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="font-bold">
                            Email:
                        </label>
                        <input
                            name="email"
                            id="email"
                            value={formData.email}
                            placeholder="Email..."
                            className="block border p-1 px-3 rounded-md mt-2 w-full"
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="font-bold">
                            Phone:
                        </label>
                        <input
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            placeholder="Phone..."
                            className="block border p-1 px-3 rounded-md mt-2 w-full"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="font-bold">
                            Address:
                        </label>
                        <input
                            name="address"
                            id="address"
                            value={formData.address}
                            placeholder="Address..."
                            className="block border p-1 px-3 rounded-md mt-2 w-full"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="font-bold">Rank:</label>
                        <select
                            name="rank"
                            value={formData.rank}
                            onChange={handleChange}
                            className="border p-1 px-3 rounded-md mt-2"
                        >
                            <option value="">Select rank</option>
                            <option value="GOLD">Gold</option>
                            <option value="SILVER">Silver</option>
                            <option value="BRONZE">Bronze</option>
                        </select>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

export default Customers;
