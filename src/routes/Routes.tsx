// import Customers from "../2026-04-11/pages/Customers";
import config from "../config";

// Pages
import Home from "../pages/Home";
import Table from "../homeworks/2026-04-07/Table";
// Homework 41 & 42
import Login from "../homeworks/2026-04-11/pages/Login";
import Customers from "../homeworks/2026-04-11/pages/Customers";
import Products from "../homeworks/2026-04-11/pages/Products";
// Homework 43
import Login1 from "../homeworks/2026-04-18/pages/Login";
import Customers1 from "../homeworks/2026-04-18/pages/Customers";
import Products1 from "../homeworks/2026-04-18/pages/Products";

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.homework_40, component: Table },

    { path: config.routes.homework_41_login, component: Login },
    { path: config.routes.homework_41_customers, component: Customers },
    { path: config.routes.homework_41_products, component: Products },

    { path: config.routes.homework_43_login, component: Login1 },
    { path: config.routes.homework_43_customers, component: Customers1 },
    { path: config.routes.homework_43_products, component: Products1 },
];

// Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
