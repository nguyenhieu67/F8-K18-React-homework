import { TableHead, TableRow, TableCell } from "@mui/material";
import type { Column } from "../../utils/type";
import { memo } from "react";

interface Props {
    columns: Column[];
}

function TableHeader({ columns }: Props) {
    console.log("re-render-TableHeader");
    return (
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
    );
}

export default memo(TableHeader);
