/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableCell, TableRow } from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { forwardRef, memo } from "react";

const TableRowC = forwardRef<HTMLTableRowElement, any>(function TableRowC(
    { row, columns, onClickEdit, onClickDelete },
    ref,
) {
    console.log("re-render-TableRow");
    return (
        <TableRow ref={ref}>
            {columns?.map((column: any) => {
                if (column.value === "actions") {
                    return (
                        <TableCell key={column.value}>
                            <EditOutlined
                                sx={{
                                    marginRight: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => onClickEdit?.(row?.id)}
                            />
                            <DeleteOutlined
                                sx={{
                                    color: "red",
                                    cursor: "pointer",
                                }}
                                onClick={() => onClickDelete?.(row?.id)}
                            />
                        </TableCell>
                    );
                }
                return (
                    <TableCell style={column.style} key={column.value}>
                        {column.render
                            ? ((column.render(row) as React.ReactNode) ?? "")
                            : (row[column.value] as React.ReactNode)}
                    </TableCell>
                );
            })}
        </TableRow>
    );
});

export default memo(TableRowC);
