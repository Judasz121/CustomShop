import React from 'react';
import AppRouter from "../router";
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch } from "react-router-dom";
import Constants from '../router/constants';
import style from "../styles/nav.module.css";
import { INavItem } from '../types/navTypes';

class MainUpperNavbar extends React.Component{
    constructor(props:any) {
        super(props);
    }
    render() {
        return (
            <div className={style.mainNavbar}>
                <HomeLogo  />
                    <div className="mainNavItems">
                        <nav>
                        <ul className={style.navItemsList}>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/adminPanel">Admin panel</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                <AuthInfoHorizontal />
            </div>

        )
    }
}
type HomeLogoProps = {
    imgUrl?: string
}
function HomeLogo({ imgUrl } : HomeLogoProps) {
    return (
        <span className="homeLogo">
            <Link to="/" >
                <img src={imgUrl} className="homeLogo" />
            </Link>
        </span>
    );
}
type AuthInfoHorizontalState = {
    ajaxResponse: {
        userName: string,
        isLoggedIn: boolean
    }
}

class AuthInfoHorizontal extends React.Component<{}, AuthInfoHorizontalState> {
    constructor(props: object) {
        super(props);
        this.state = {
            
            ajaxResponse: {
                userName: "",
                isLoggedIn: false,
            }
        }

        this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
        this.checkIfLoggedIn();
    }

    logOut() {
        let logOutUrl = Constants.baseUrl + "/API/Auth/LogOut";
        let dataToSend = { returnUrl: Constants.baseUrl }
        fetch(logOutUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend)
        })
            .then(() => {
                window.location.reload();
            })
    }
    render() {
        if (this.state.ajaxResponse.isLoggedIn == true)
            return (
                <div className={style.authInfoHorizontal}>
                    user is logged in
                    <div className={style.linksContainer} >
                        <button title="log out" onClick={this.logOut} > Log out </button>
                        <Link to="/userPanel">UserPanel link</Link>
                    </div>
                </div>

            )
        else
            return (
                <div className={style.authInfoHorizontal}>
                    user is not logged in
                    <Link to="/register">RegisterPage link</Link>
                    <Link to="/logIn">LogInPage link</Link>
                </div>
            )
    }
    async checkIfLoggedIn() {
        let AuthStatusUrl = Constants.baseUrl + "/API/Auth/AuthStatus";
        const response = await fetch(AuthStatusUrl, {
            method: "GET"
        });
        response.json().then(data => {
            this.setState({
                ajaxResponse: {
                    userName: data.userName,
                    isLoggedIn: data.isLoggedIn
                }
            });
        });
    }
}
type SubNavMenuProps = {
    navItems: INavItem[],
}
export function SubNavMenu(props: SubNavMenuProps) {
    return (
        <nav>
            <ul>
                {
                    props.navItems.map((item) => {
                        return (
                            <li>
                                <Link to={item.url}>{item.text}</Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
}
export default MainUpperNavbar