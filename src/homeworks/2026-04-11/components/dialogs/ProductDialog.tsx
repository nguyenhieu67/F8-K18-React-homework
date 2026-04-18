import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogContent,
} from "@mui/material";

import type { Product, Category } from "../../../utils/type";

interface Props {
    product: Product | null;
    categories: Category[];
    validate: { name?: string; category?: string };
    onChange: (data: Product) => void;
}

function ProductDialog({ product, categories, validate, onChange }: Props) {
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | { target: { name?: string; value: unknown } },
    ) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === "price" || name === "remaining") {
            newValue = value === "" ? 0 : Number(value);
        }

        if (name === "category") {
            const selectedCat = categories.find(
                (cat) => Number(cat.id) === Number(value),
            );
            onChange({
                ...product,
                category: {
                    id: Number(selectedCat?.id),
                    name: selectedCat?.name,
                },
            } as Product);
        } else {
            onChange({
                ...(product || {}),
                [name as string]: newValue,
            } as Product);
        }
    };

    return (
        <DialogContent>
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Name"
                name="name"
                value={product?.name || ""}
                onChange={handleChange}
            />
            {validate.name && (
                <p className="text-red-500 text-xs mt-1">{validate.name}</p>
            )}
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Price"
                name="price"
                value={product?.price || ""}
                onChange={handleChange}
            />

            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Sku"
                name="sku"
                value={product?.sku || ""}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Remaining"
                name="remaining"
                value={product?.remaining || ""}
                onChange={handleChange}
            />
            <FormControl margin="dense" sx={{ width: "30%" }}>
                <InputLabel id="categories">Categories</InputLabel>
                <Select
                    label="Categories"
                    labelId="categories"
                    name="category"
                    value={
                        product?.category?.id ? String(product.category.id) : ""
                    }
                    onChange={handleChange}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={String(category.id)}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {validate.category && (
                <p className="text-red-500 text-xs mt-1">{validate.category}</p>
            )}
        </DialogContent>
    );
}

export default ProductDialog;
