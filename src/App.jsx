import { useState } from "react";
import Table from "./2026-04-07/Table";

function App() {
    const [selectId, setSelectId] = useState(null);

    const homeworks = [
        {
            id: 1,
            date: "2026-04-07",
            component: <Table />,
        },
        {
            id: 2,
            date: "2026-04-11",
            component: null,
        },
    ];

    const handleShow = (id) => {
        setSelectId(selectId === id ? null : id);
    };

    return (
        <div style={{ padding: 20 }}>
            <ul className="flex gap-4 items-start relative">
                {homeworks.map((item) => (
                    <li key={item.id} className="p-2 bg-[#ebebeb] rounded-lg">
                        <button onClick={() => handleShow(item.id)}>
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
