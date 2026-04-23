import { NavLink, useLocation } from "react-router-dom";
import config from "../config";

const sidebarList = [
    {
        path: config.routes.home,
        title: "Home",
    },
    {
        path: config.routes.homework_40,
        title: "Homework 40",
    },
    {
        path: config.routes.homework_41_login,
        title: "Homework 41 & 42",
    },
    {
        path: config.routes.homework_43_login,
        title: "Homework 43",
    },
    {
        path: config.routes.homework_44_login,
        title: "Homework 44",
    },
];

function Sidebar() {
    const { pathname } = useLocation();

    const checkIsActive = (pathname: string, itemPath: string) => {
        if (itemPath === "/") {
            return pathname === "/" || pathname === "/F8-K18-React-homework/";
        }

        const basePath = itemPath.split("/").slice(0, 2).join("/");
        return pathname.includes(basePath);
    };

    return (
        <aside className="p-6.25 h-screen">
            <h1 className="mb-7.5 text-center text-2xl font-bold text-[#3498db]">
                Homework List
            </h1>
            <ul>
                {sidebarList.map((item) => {
                    const isActive = checkIsActive(pathname, item.path);

                    return (
                        <li key={item.title} className={`mb-1.25`}>
                            <NavLink
                                to={item.path}
                                className={`flex rounded-lg p-3 font-medium ${isActive ? "bg-[#34495e] text-[#3498db]" : "text-white hover:bg-[#34495e] hover:text-[#3498db]"}`}
                            >
                                {item.title}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

export default Sidebar;
