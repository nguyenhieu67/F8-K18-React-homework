import { useState } from "react";
import Table from "./2026-04-07/Table";
import Login from "./2026-04-11/Login";
import Customers from "./2026-04-11/Customers";

function App() {
    const [selectId, setSelectId] = useState<number | null>(null);

    const homeworks = [
        {
            id: 1,
            date: "2026-04-07",
            component: <Table />,
        },
        {
            id: 2,
            date: "2026-04-11 / Login",
            component: <Login onLoginSuccess={() => setSelectId(3)} />,
        },
        {
            id: 3,
            date: "2026-04-11 / Customer",
            component: <Customers onLoginFail={() => setSelectId(2)} />,
        },
    ];

    const handleShow = (id: number) => {
        setSelectId(selectId === id ? null : id);
    };

    return (
        <div style={{ padding: 20 }}>
            <ul className="flex gap-4 items-start relative">
                {homeworks.map((item) => (
                    <li key={item.id}>
                        <button
                            className={`${selectId === item.id ? "bg-[#888]" : "bg-[#ebebeb]"} p-2 rounded-lg hover:bg-[#888] cursor-pointer`}
                            onClick={() => handleShow(item.id)}
                        >
                            {item.date}
                        </button>
                        {selectId === item.id && (
                            <div className=" absolute w-full top-0 left-0 p-5 mt-10">
                                {item.component || <h1>Chưa có bài tập mới</h1>}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
