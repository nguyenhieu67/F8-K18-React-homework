import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes } from "./routes/Routes";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
    return (
        <div>
            <Router basename="/F8-K18-React-homework">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        const Layout = DefaultLayout;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
