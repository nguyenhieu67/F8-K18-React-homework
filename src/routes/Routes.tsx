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
// Homework 44
import Test from "../homeworks/2026-04-21/pages/Test";
import Login2 from "../homeworks/2026-04-21/pages/Login";
import Orders from "../homeworks/2026-04-21/pages/Orders";
// Homework 45
import Test45 from "../homeworks/2026-04-25/Test45";

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

    { path: config.routes.homework_44, component: Test },
    { path: config.routes.homework_44_login, component: Login2 },
    { path: config.routes.homework_44_orders, component: Orders },

    { path: config.routes.homework_45, component: Test45 },
];

// Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
