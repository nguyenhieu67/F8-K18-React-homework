// import Customers from "../2026-04-11/pages/Customers";
import config from "../config";

// Pages
import Home from "../pages/Home";
import Table from "../homeworks/2026-04-07/Table";
import Login from "../homeworks/2026-04-11/pages/Login";
import Customers from "../homeworks/2026-04-11/pages/Customers";
import Products from "../homeworks/2026-04-11/pages/Products";

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.homework_40, component: Table },
    { path: config.routes.homework_41_login, component: Login },
    { path: config.routes.homework_41_customers, component: Customers },
    { path: config.routes.homework_41_products, component: Products },
    { path: config.routes.homework_42, component: "" },
];

// Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
