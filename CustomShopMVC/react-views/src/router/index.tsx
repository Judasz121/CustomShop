import React from "react";
import { Router, Route, Switch, Link, NavLink } from "react-router-dom";
import * as createHistory from "history";
import HomePage from "../pages/Home";
import LogInPage from "../pages/LogIn";
import RegisterPage from "../pages/Register";
import AdminPanelPage from "../pages/AdminPanel";

// Instead of BrowserRouter, we use the regular router,
// but we pass in a customer history to it.
export const history = createHistory.createBrowserHistory();

const AppRouter = () => (
    <Router history={history}>
        <div className="Router">
            {/*<nav>*/}
            {/*    <ul>*/}
            {/*        <li>*/}
            {/*            <Link to="/">Homepage link text</Link>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <Link to="/loginPage">LoginPage link text</Link>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <Link to="/registerPage">RegisterPage link text</Link>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <Link to="/adminPanelPage">Admin panel page link text</Link>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</nav>*/}
            {/*<Switch>*/}
            {/*    <Route path="/loginPage" >*/}
            {/*        <LogInPage />*/}
            {/*    </Route>*/}
            {/*    <Route path="/registerPage" >*/}
            {/*        <RegisterPage />*/}
            {/*    </Route>*/}
            {/*    <Route path="/adminPanelPage" >*/}
            {/*        <AdminPanelPage />*/}
            {/*    </Route>*/}
            {/*    <Route path="/" >*/}
            {/*        <HomePage />*/}
            {/*    </Route>*/}
            {/*</Switch>*/}
        </div>
    </Router>
);

export default AppRouter;