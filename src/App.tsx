import { useState } from "react";

import Table from "./2026-04-07/Table";
import Login from "./2026-04-11/pages/Login";
import Customers from "./2026-04-11/pages/Customers";
import Products from "./2026-04-11/pages/Products";
import { checkAuth } from "./2026-04-11//plugins/axios";

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
            component: <Customers />,
        },
        {
            id: 4,
            date: "2026-04-11 / Products",
            component: <Products />,
        },
    ];

    const handleShow = async (id: number) => {
        if (selectId === id) {
            setSelectId(null);
            return;
        }
        const protectedTabs = [3, 4];

        if (protectedTabs.includes(id)) {
            const isAuthorized = await checkAuth();

            if (!isAuthorized) {
                alert("Vui lòng đăng nhập để tiếp tục!");
                setSelectId(2);
                return;
            }
        }
        setSelectId(id);
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
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                {selectId === null ? (
                    <h1 className="flex justify-center">
                        Vui lòng chọn một bài tập để xem
                    </h1>
                ) : (
                    homeworks.find((item) => item.id === selectId)?.component
                )}
            </div>
        </div>
    );
}

export default App;
