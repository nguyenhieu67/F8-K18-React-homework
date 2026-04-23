import { TableBody, TableRow, TableCell } from "@mui/material";
import type { Column, Row } from "../../utils/type";
import TableRowC from "./TableRow";
import { memo, useEffect, useRef, useState } from "react";

interface Props {
    columns: Column[];
    rows: Row[];
    layout?: number;
    onClickEdit?: (id: number) => void;
    onClickDelete?: (id: number) => void;
}

function TableBodyC({
    columns,
    rows,
    layout = 0,
    onClickEdit,
    onClickDelete,
}: Props) {
    const rowRef = useRef<HTMLTableRowElement>(null);
    const [rowHeight, setRowHeight] = useState(0);

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(rowRef.current.offsetHeight);
        }
    }, [rows]);

    console.log("re-render-Body");

    return (
        <TableBody>
            {rows.map((row) => {
                return (
                    <TableRowC
                        ref={rowRef}
                        key={row.id}
                        row={row}
                        columns={columns}
                        onClickEdit={onClickEdit}
                        onClickDelete={onClickDelete}
                    />
                );
            })}
            {layout > 0 && (
                <TableRow style={{ height: rowHeight * layout }}>
                    <TableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>
    );
}

export default memo(TableBodyC);
