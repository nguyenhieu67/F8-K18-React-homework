import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

import type { Column, Row } from "../../utils/type";

interface Props {
    columns: Column[];
    rows: Row[];
    maxWidth?: number | string;
    size?: string;
    onClickEdit?: (id: number) => void;
    onClickDelete?: (id: number) => void;
}

function TableComp({
    columns,
    rows,
    maxWidth,
    size = "small",
    onClickEdit,
    onClickDelete,
}: Props) {
    const onEdit = (id: number) => onClickEdit && onClickEdit(id);
    const onDelete = (id: number) => onClickDelete && onClickDelete(id);

    return (
        <TableContainer component={Paper} sx={{ maxWidth, margin: "auto" }}>
            <Table size={size as "small" | "medium"} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => {
                            return (
                                <TableCell key={column.value} sx={column.style}>
                                    {column.text}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                {columns.map((column) => {
                                    if (column.value === "actions") {
                                        return (
                                            <TableCell key={column.value}>
                                                <EditOutlined
                                                    sx={{
                                                        marginRight: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        onEdit(row.id)
                                                    }
                                                />
                                                <DeleteOutlined
                                                    sx={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        onDelete(row.id)
                                                    }
                                                />
                                            </TableCell>
                                        );
                                    }
                                    return (
                                        <TableCell
                                            style={column.style}
                                            key={column.value}
                                        >
                                            {column.render
                                                ? (column.render(row) ?? "")
                                                : row[column.value]}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableComp;
