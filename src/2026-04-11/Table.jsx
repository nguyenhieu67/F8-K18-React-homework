function Table({ customersData, onEdit, onDelete }) {
    const columns = [
        {
            value: "customer",
            text: "Customer",
            style: {
                textAlign: "center",
            },
            render: (customer) => (
                <div>
                    <strong>{customer.name}</strong>
                    <br />
                    <small>ID:{customer.id}</small>
                </div>
            ),
        },
        {
            value: "contact",
            text: "Contact",
            render: (customer) => {
                const phone = customer.phone;
                if (phone?.length === 10) {
                    return (
                        <div>
                            {customer.email}
                            <br />
                            <small>
                                {phone.slice(0, 4)}.{phone.slice(4, 7)}
                                .xxx
                            </small>
                        </div>
                    );
                }
                return (
                    <div>
                        {customer.email}
                        <br />
                        <small>{phone}</small>
                    </div>
                );
            },
        },
        {
            value: "rank",
            text: "Rank",
            style: {
                color: "red",
            },
        },
        {
            value: "address",
            text: "Address",
        },
        {
            value: "totalSpending",
            text: "Total spending",
            render: (customer) => customer.totalSpending || 0,
        },
        {
            value: "actions",
            text: "Action",
            render: (customer) => (
                <div>
                    <button
                        className="bg-[#ebebeb] hover:bg-[#888] rounded-md p-1 cursor-pointer"
                        onClick={() => onEdit(customer)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-[#ebebeb] hover:bg-[#888] rounded-md p-1 ml-4 cursor-pointer"
                        onClick={() => onDelete(customer.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <table className="w-full  border-collapse border">
            <thead>
                <tr>
                    {columns.map((column) => {
                        return (
                            <th key={column.value} className="border">
                                {column.text}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {customersData.map((customer) => {
                    return (
                        <tr key={customer.id}>
                            {columns.map((column) => {
                                return (
                                    <td key={column.value}>
                                        {column.render
                                            ? column.render(customer)
                                            : customer[column.value]}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default Table;
