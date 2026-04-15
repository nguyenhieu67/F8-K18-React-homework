import { useState } from "react";

function Table() {
    const columns = [
        {
            value: "id",
            text: "ID",
            style: {
                textAlign: "center",
            },
        },
        {
            value: "name",
            text: "Teen",
        },
        {
            value: "age",
            text: "Tuoi",
            style: {
                color: "red",
            },
        },
        {
            value: "class",
            text: "Lop",
        },
        {
            value: "address",
            text: "Dia CHi",
        },
        {
            value: "action",
            text: "Thao tac",
        },
    ];

    const data = [
        {
            id: 1,
            name: "Nguyen Van A",
            age: 15,
            class: "10A1",
            address: "Ha Noi",
        },
        {
            id: 2,
            name: "Tran Thi B",
            age: 16,
            class: "10A2",
            address: "Hai Phong",
        },
        { id: 3, name: "Le Van C", age: 15, class: "10A1", address: "Da Nang" },
        {
            id: 4,
            name: "Pham Thi D",
            age: 17,
            class: "11A1",
            address: "Ha Noi",
        },
        {
            id: 5,
            name: "Hoang Van E",
            age: 16,
            class: "10A3",
            address: "Nam Dinh",
        },
        {
            id: 6,
            name: "Do Thi F",
            age: 15,
            class: "10A2",
            address: "Thai Binh",
        },
        {
            id: 7,
            name: "Bui Van G",
            age: 17,
            class: "11A2",
            address: "Hai Duong",
        },
        { id: 8, name: "Vu Thi H", age: 16, class: "10A3", address: "Ha Noi" },
        {
            id: 9,
            name: "Dang Van I",
            age: 15,
            class: "10A1",
            address: "Bac Ninh",
        },
        {
            id: 10,
            name: "Ngo Thi K",
            age: 17,
            class: "11A1",
            address: "Ha Nam",
        },
    ];

    const [students, setStudents] = useState(data);

    const handleEdit = (id: number) => {
        const findStudent = students.find((s) => s.id === id);
        alert(`
                Id: ${findStudent?.id},
                Teen: ${findStudent?.name},
                Tuoi: ${findStudent?.age},
                Lop: ${findStudent?.class},
                Dia Chi: ${findStudent?.address},
            `);
    };

    const handleDelete = (id: number) => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
    };

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
                {students.map((student) => {
                    return (
                        <tr key={student.id}>
                            {columns.map((column) => {
                                if (column.value === "action") {
                                    return (
                                        <td key={column.value}>
                                            <button
                                                className="bg-[#ebebeb] rounded-md p-1"
                                                onClick={() =>
                                                    handleEdit(student.id)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-[#ebebeb] rounded-md p-1 ml-4"
                                                onClick={() =>
                                                    handleDelete(student.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={column.value}>
                                        {
                                            student[
                                                column.value as keyof typeof student
                                            ]
                                        }
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
