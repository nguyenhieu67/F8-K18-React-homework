import { TableContainer, Paper, Table } from "@mui/material";
import { memo, useState, useMemo } from "react";
import type { Column, Row } from "../../utils/type";

import TableHeader from "./TableHeader";
import TableBodyC from "./TableBody";
import TableFooterC from "./TableFooter";

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
    // Table footer handle
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const emptyRows = useMemo(() => {
        return page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
            : 0;
    }, [rows, page, rowsPerPage]);

    const visibleRows = useMemo(() => {
        if (!rows || rows.length === 0) return [];
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;

        return rowsPerPage > 0 ? rows.slice(start, end) : rows;
    }, [rows, page, rowsPerPage]);

    console.log("re-render-Table");

    return (
        <TableContainer component={Paper} sx={{ maxWidth, margin: "auto" }}>
            <Table size={size as "small" | "medium"} aria-label="simple table">
                <TableHeader columns={columns} />
                <TableBodyC
                    columns={columns}
                    rows={visibleRows}
                    layout={emptyRows}
                    onClickEdit={onClickEdit}
                    onClickDelete={onClickDelete}
                />
                <TableFooterC
                    rows={rows}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(newPage) => setPage(newPage)}
                    onRowsPerPageChange={(newSize) => {
                        setRowsPerPage(newSize);
                        setPage(0);
                    }}
                />
            </Table>
        </TableContainer>
    );
}

export default memo(TableComp);
