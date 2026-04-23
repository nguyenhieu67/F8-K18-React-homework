/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    TextField,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from "@mui/material";

import type { Customer, Order, Product } from "../../../../utils/type";
import { formatAndMaskPhone, formatPrice } from "../../../../utils/action";

interface Props {
    order: Order | null;
    products: Product[];
    customers: Customer[];
    validate: { productId?: number | string; customerId?: number | string };
    onChange: (data: Order) => void;
}

function OrderDialog({
    order,
    products,
    customers,
    validate,
    onChange,
}: Props) {
    const handleChange = (
        e:
            | SelectChangeEvent<any>
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        let newValue = value;
        if (
            name === "productId" ||
            name === "customerId" ||
            name === "amount"
        ) {
            newValue = value === "" ? 0 : Number(value);
        }

        onChange({
            ...(order || {}),
            [name as any]: newValue,
        } as Order);
    };

    return (
        <DialogContent>
            <FormControl margin="dense" sx={{ width: "100%" }}>
                <InputLabel id="product">Product</InputLabel>
                <Select
                    label="Product"
                    labelId="product"
                    name="productId"
                    value={order?.productId || order?.product?.id || ""}
                    onChange={handleChange}
                >
                    {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.name} - (
                            {formatPrice(product.price as any)})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {validate.productId && (
                <p className="text-red-500 text-xs mt-1">
                    {validate.productId}
                </p>
            )}
            <FormControl margin="dense" sx={{ width: "100%" }}>
                <InputLabel id="customer">Customer</InputLabel>
                <Select
                    label="Customer"
                    labelId="customer"
                    name="customerId"
                    value={order?.customerId || order?.customer?.id || ""}
                    onChange={handleChange}
                >
                    {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                            {customer.name} - (
                            {formatAndMaskPhone(customer.phone || "Not phone")})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {validate.customerId && (
                <p className="text-red-500 text-xs mt-1">
                    {validate.customerId}
                </p>
            )}
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Amount"
                name="amount"
                value={order?.amount || ""}
                onChange={handleChange}
            />
            <FormControl margin="dense" sx={{ width: "100%" }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                    label="Status"
                    labelId="status"
                    name="status"
                    value={order?.status || ""}
                    onChange={handleChange}
                >
                    <MenuItem value="done">Done</MenuItem>
                    <MenuItem value="delivering">Delivering</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancel">Cancel</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
    );
}

export default OrderDialog;
