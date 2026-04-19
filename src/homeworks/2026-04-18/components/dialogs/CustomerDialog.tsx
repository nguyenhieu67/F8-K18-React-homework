import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogContent,
} from "@mui/material";

import type { Customer } from "../../../../utils/type";

interface Props {
    customer: Customer | null;
    validate: { name?: string; email?: string };
    onChange: (data: Customer) => void;
}

function CustomerDialog({ customer, validate, onChange }: Props) {
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | { target: { name?: string; value: unknown } },
    ) => {
        const { name, value } = e.target;
        if (name) {
            onChange({
                ...customer,
                [name as string]: value,
            } as Customer);
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
                value={customer?.name || ""}
                onChange={handleChange}
            />
            {validate.name && (
                <p className="text-red-500 text-xs mt-1">{validate.name}</p>
            )}
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Email"
                name="email"
                value={customer?.email || ""}
                onChange={handleChange}
            />
            {validate.email && (
                <p className="text-red-500 text-xs mt-1">{validate.email}</p>
            )}
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Phone"
                name="phone"
                value={customer?.phone || ""}
                onChange={handleChange}
            />
            <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Address"
                name="address"
                value={customer?.address || ""}
                onChange={handleChange}
            />
            <FormControl margin="dense" sx={{ width: "30%" }}>
                <InputLabel id="rank">Rank</InputLabel>
                <Select
                    label="Rank"
                    labelId="rank"
                    name="rank"
                    value={customer?.rank || ""}
                    onChange={handleChange}
                >
                    <MenuItem value="GOLD">Gold</MenuItem>
                    <MenuItem value="SILVER">Silver</MenuItem>
                    <MenuItem value="BRONZE">Bronze</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
    );
}

export default CustomerDialog;
