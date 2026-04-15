interface Style {
    [key: string]: string;
}

interface Column {
    value: string;
    text: string;
    style?: Style;
    render?: (item: any) => React.ReactNode;
}

interface Row {
    id: number;
    [key: string]: string | number | undefined;
}

interface Customer extends Row {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    rank?: string;
}

export type { Row, Column, Customer };
