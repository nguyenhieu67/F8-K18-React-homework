/* eslint-disable @typescript-eslint/no-explicit-any */
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
    [key: string]: string | number | undefined | object;
}

interface Category {
    id: number;
    name: string;
}

interface Customer extends Row {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    rank?: string;
}

interface Product extends Row {
    id: number;
    name: string;
    imageId?: string;
    price?: string;
    sku?: string;
    remaining?: string;
    category: Category;
}

export type { Row, Column, Customer, Product, Category };
