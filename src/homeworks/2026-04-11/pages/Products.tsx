import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
} from "@mui/material";

import api from "../plugins/axios";
import config from "../../../config";
import type { Column, Product, Category } from "../../../utils/type";
import { Table, Dialog, ProductDialog } from "../components";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
        null,
    );
    const [errors, setErrors] = useState<{
        name?: string;
        category?: string;
    }>({});

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

    const filterProducts =
        selectedCategory === ""
            ? products
            : products.filter(
                  (p) => String(p.category.id) === selectedCategory,
              );

    const productForm: Product = {
        id: 0,
        category: { id: 0, name: "" },
        name: "",
        price: "",
        sku: "",
        remaining: "",
    };

    const [formData, setFormData] = useState(productForm);

    const columns: Column[] = [
        {
            value: "avatar",
            text: "Avatar",
            render: (product: Product) => (
                <img
                    src={`https://picsum.photos/200?random=${product.id}`}
                    alt={product.name}
                    className="w-11.25 h-11.25 object-cover rounded-md"
                />
            ),
        },
        {
            value: "product",
            text: "Product information",
            render: (product: Product) => (
                <div>
                    <strong>{product.name}</strong>
                    <br />
                    <small>SKU: {product.sku}</small>
                </div>
            ),
        },
        {
            value: "category",
            text: "Category",
            render: (product: Product) => product?.category?.name,
        },
        {
            value: "price",
            text: "Price",
            render: (product: Product) =>
                Number(product.price).toLocaleString("vi-VN") + "đ",
        },
        {
            value: "remaining",
            text: "Remaining",
        },
        {
            value: "actions",
            text: "Action",
        },
    ];

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const [products, categories] = await Promise.all([
                    api.get<Product[]>("/products"),
                    api.get<Category[]>("/categories"),
                ]);

                setProducts(products as unknown as Product[]);
                setCategories(categories as unknown as Category[]);
            } catch (error: unknown) {
                getError(error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            const timer = setTimeout(() => {
                setFormData({
                    id: 0,
                    category: selectedProduct.category || { id: 0, name: "" },
                    name: selectedProduct.name || "",
                    price: selectedProduct.price || "",
                    sku: selectedProduct.sku || "",
                    remaining: selectedProduct.remaining || "",
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [selectedProduct]);

    const handleModelOpen = () => {
        setSelectedProduct(null);
        setFormData(productForm);
        setIsModelOpen(true);
        setErrors({});
    };

    const handleChangeForm = (newData: Product) => {
        setSelectedProduct(newData);
    };

    const validateForm = () => {
        const newErrors: { category?: string; name?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "The name cannot be left blank.";
        }

        const categoryId = formData.category?.id;

        if (!categoryId || categoryId === 0) {
            newErrors.category = "Please select a category.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (id: number) => {
        if (!validateForm()) return;

        try {
            let response: Product;

            if (id) {
                response = await api.put(`/products/${id}`, {
                    ...formData,
                    categoryId: Number(formData.category.id),
                });

                setProducts((prev) =>
                    prev.map((item) => (item.id === id ? response : item)),
                );
                toastify("Updated successfully");
            } else {
                response = await api.post("/products", {
                    ...formData,
                    categoryId: Number(formData.category.id),
                });

                setProducts((prev) => [response, ...prev]);
                toastify("Created successfully");
            }
            setIsModelOpen(false);
            setSelectedProduct(null);
            setErrors({});
        } catch (error) {
            getError(error);
        }
    };

    const handelEdit = (id: number) => {
        const findP = products.find((p) => p.id === id);
        setSelectedProduct(findP || null);
        setIsModelOpen(true);
        setErrors({});
    };

    const openConfirmDelete = (id: number) => {
        const findP = products.find((p) => p.id === id);
        setSelectedProduct(findP || null);
        setProductIdToDelete(id);
        setIsConfirmDelete(true);
    };

    const handleDelete = async () => {
        if (!productIdToDelete) return;

        try {
            await api.delete(`/products/${productIdToDelete}`);
            setProducts((prev) =>
                prev.filter((item) => item.id !== productIdToDelete),
            );
            toastify("Deleted successfully");
        } catch (error) {
            getError(error);
        } finally {
            setIsConfirmDelete(false);
            setProductIdToDelete(null);
        }
    };

    return (
        <div>
            <nav className="flex gap-5 text-white">
                <NavLink
                    to={config.routes.homework_41_customers}
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400"
                >
                    Customers
                </NavLink>
                <NavLink
                    to={config.routes.homework_41_products}
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400"
                >
                    Products
                </NavLink>
            </nav>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress aria-label="Loading…" />
                </Box>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-6">
                        <button
                            className="bg-[#3498db] hover:opacity-90 text-white rounded-lg px-4 py-2 cursor-pointer"
                            onClick={handleModelOpen}
                        >
                            + Create product
                        </button>
                    </div>
                    <ToastContainer />

                    <div className="flex justify-end items-center">
                        <FormControl sx={{ width: "20%" }}>
                            <InputLabel id="categories">Categories</InputLabel>
                            <Select
                                label="Categories"
                                labelId="categories"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                            >
                                <MenuItem value="">
                                    <em>All categories</em>
                                </MenuItem>
                                {categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={String(category.id)}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Table
                        columns={columns}
                        rows={filterProducts}
                        onClickEdit={handelEdit}
                        onClickDelete={openConfirmDelete}
                    />
                </div>
            )}

            {/* Product */}
            <Dialog
                title={
                    selectedProduct?.id
                        ? `Edit product name: ${selectedProduct.name}`
                        : "Create product"
                }
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                onSubmit={() => handleSubmit(selectedProduct?.id || 0)}
            >
                <ProductDialog
                    product={selectedProduct}
                    categories={categories}
                    validate={errors}
                    onChange={handleChangeForm}
                />
            </Dialog>

            <Dialog
                title={`Are you sure delete ${selectedProduct?.name || "product"}?`}
                isOpen={isConfirmDelete}
                onClose={() => setIsConfirmDelete(false)}
                onSubmit={handleDelete}
            ></Dialog>
        </div>
    );
}

export default Products;
