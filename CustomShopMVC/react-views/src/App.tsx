import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRouter from "./router";
import MainUpperNavbar from "./components/navComponents";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";
import RegisterPage from "./pages/Register";
import AdminPanelPage from "./pages/AdminPanel";
import UserPanelPage from "./pages/UserPanel";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import style from "./styles/global.module.css"

function App() {
    return (
        <Router>
            <div id="App">
                <nav className={style.rootNavigation} >
                    <MainUpperNavbar />
                </nav>

                <main className={style.rootContent}>

                    <Switch>
                        <Route path="/logIn" >
                            <LogInPage />
                        </Route>
                        <Route path="/register" >
                            <RegisterPage />
                        </Route>
                        <Route path="/adminPanel" component={AdminPanelPage} />
                        <Route path="/userPanel" component={UserPanelPage} />

                        <Route path="/" >
                            <HomePage />
                        </Route>
                    </Switch>

                </main>
            </div>
        </Router>
    );
}

export default App;
