import { TableFooter, TablePagination, TableRow } from "@mui/material";

import type { Row } from "../../utils/type";
import { TableFooterActions } from "./TableFooterAction";

interface Props {
    rows: Row[];
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
}

function TableFooterC({
    rows,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: Props) {
    console.log("re-render-TableFooter");
    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                    ]}
                    colSpan={12}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{
                        select: {
                            inputProps: {
                                "aria-label": "rows per page",
                            },
                            native: true,
                        },
                    }}
                    onPageChange={(_, newPage) => onPageChange(newPage)}
                    onRowsPerPageChange={(event) =>
                        onRowsPerPageChange(parseInt(event.target.value, 10))
                    }
                    ActionsComponent={TableFooterActions}
                />
            </TableRow>
        </TableFooter>
    );
}

export default TableFooterC;
