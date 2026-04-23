import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Autocomplete, TextField } from "@mui/material";

import config from "../../../config";
import type { Column, Product, Category } from "../../../utils/type";
import { Dialog, ProductDialog } from "../components";
import { fetchApi } from "../../../utils/api";
import { getError, toastMsg } from "../../../utils/message";
import Table from "../../../components/Table";
import { formatPrice } from "../../../utils/action";

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
    const navigate = useNavigate();

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
            render: (product: Product) => formatPrice(product?.price),
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

    const categoryOptions = products.reduce((acc, curr) => {
        const isExisted = acc.find((item) => item.id === curr.category.id);
        if (!isExisted) {
            return [...acc, curr.category];
        }
        return acc;
    }, [] as Category[]);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const [products, categories] = await Promise.all([
                    fetchApi.get<Product[]>("/products"),
                    fetchApi.get<Category[]>("/categories"),
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

    const openConfirmDelete = (id: number) => {
        const findP = products.find((p) => p.id === id);
        setSelectedProduct(findP || null);
        setProductIdToDelete(id);
        setIsConfirmDelete(true);
    };

    const handleChangeForm = (newData: Product) => {
        if (newData.name) {
            setErrors((prev) => ({ ...prev, name: "" }));
        }
        if (newData.category) {
            setErrors((prev) => ({ ...prev, category: "" }));
        }

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

    const handelEdit = (id: number) => {
        const findP = products.find((p) => p.id === id);
        setSelectedProduct(findP || null);
        setIsModelOpen(true);
        setErrors({});
    };

    const handleDelete = async () => {
        if (!productIdToDelete) return;

        try {
            await fetchApi.delete(`/products/${productIdToDelete}`);
            setProducts((prev) =>
                prev.filter((item) => item.id !== productIdToDelete),
            );
            toastMsg("Deleted successfully");
        } catch (error) {
            getError(error);
        } finally {
            setIsConfirmDelete(false);
            setProductIdToDelete(null);
        }
    };

    const handleSubmit = async (id: number) => {
        if (!validateForm()) return;

        try {
            let response: Product;

            if (id) {
                response = (await fetchApi.put(`/products/${id}`, {
                    ...formData,
                    categoryId: Number(formData.category.id),
                })) as Product;

                setProducts((prev) =>
                    prev.map((item) => (item.id === id ? response : item)),
                );
                toastMsg("Updated successfully");
            } else {
                response = (await fetchApi.post("/products", {
                    ...formData,
                    categoryId: Number(formData.category.id),
                })) as Product;

                setProducts((prev) => [response, ...prev]);
                toastMsg("Created successfully");
            }
            setIsModelOpen(false);
            setSelectedProduct(null);
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
                    className="p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-400"
                >
                    Customers
                </NavLink>
                <NavLink
                    to={config.routes.homework_43_products}
                    className="p-2 bg-blue-400 rounded-lg cursor-pointer hover:bg-blue-400"
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

                    <Autocomplete
                        sx={{ width: 200, marginLeft: "auto" }}
                        options={categoryOptions}
                        getOptionLabel={(option) => option.name || ""}
                        value={
                            categoryOptions.find(
                                (c) => c.id === Number(selectedCategory),
                            ) || null
                        }
                        // check id
                        // getOptionKey={(option) => option.id}
                        // check curr id
                        // isOptionEqualToValue={(option, value) =>
                        //     option.id === value?.id
                        // }
                        onChange={(_, newValue) => {
                            setSelectedCategory(
                                newValue ? newValue.id.toString() : "",
                            );
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" />
                        )}
                    />
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
                title={`Are you sure delete product is name: ${selectedProduct?.name || "product"}?`}
                isOpen={isConfirmDelete}
                onClose={() => setIsConfirmDelete(false)}
                onSubmit={handleDelete}
            ></Dialog>
        </div>
    );
}

export default Products;
