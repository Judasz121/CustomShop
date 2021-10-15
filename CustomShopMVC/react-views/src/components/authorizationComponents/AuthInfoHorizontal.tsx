import React from 'react';
import AppRouter from "../../router";
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch } from "react-router-dom";
import Constants from '../../router/constants';
import style from "../../styles/nav.module.css";
import globalStyle from "../../styles/global.module.css";
import { INavItem } from '../../types/navTypes';
import * as Icon from 'react-bootstrap-icons'

type AuthInfoHorizontalState = {
    ajaxResponse: {
        userName: string,
        isLoggedIn: boolean
    }
}

export class AuthInfoHorizontal extends React.Component<{}, AuthInfoHorizontalState> {
    constructor(props: object) {
        super(props);
        this.state = {
            
            ajaxResponse: {
                userName: "",
                isLoggedIn: false,
            }
        }

        this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
        
    }
    componentDidMount() {
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
        let iconSize: number = 35;
        if (this.state.ajaxResponse.isLoggedIn == true)
            return (
                <div className={style.authInfoHorizontal}>
                    <div className={style.linksContainer} >
                        <Link
                            to="/userPanel"
                            className={globalStyle.decorationNone}
                        >
                            <Icon.PersonCircle size={iconSize} />
                        </Link>

                        <button
                            title="log out"
                            onClick={this.logOut}
                            className={globalStyle.decorationNone}
                        >
                            <Icon.BoxArrowRight size={iconSize} />
                        </button>
                    </div>
                </div>
            )
        else
            return (
                <div className={style.authInfoHorizontal}>
                    <Link to="/register">Register</Link>
                    <Link to="/logIn">Log in</Link>
                </div>
            )
    }
    async checkIfLoggedIn() {
        let AuthStatusUrl = Constants.baseUrl + "/API/Auth/AuthStatus";
        const response = await fetch(AuthStatusUrl, {
            method: "GET"
        });
        response.json().then(data => {
            if(data.isLoggedIn)
                this.setState({
                    ajaxResponse: {
                        userName: data.user.userName,
                        isLoggedIn: true,
                    }
                });
            else
                this.setState({
                    ajaxResponse: {
                        ...this.state.ajaxResponse,
                        isLoggedIn: false,
                    }
                })
        });
    }
}