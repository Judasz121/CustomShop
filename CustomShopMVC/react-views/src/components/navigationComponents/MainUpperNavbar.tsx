import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch } from "react-router-dom";
import Constants from '../../router/constants';
import style from "../../styles/nav.module.css";
import globalStyle from "../../styles/global.module.css";
import { INavItem } from '../../types/navTypes';
import * as Icon from 'react-bootstrap-icons'
import { AuthInfoHorizontal } from '../authorizationComponents/AuthInfoHorizontal';

export default class MainUpperNavbar extends React.Component{
    constructor(props:any) {
        super(props);
    }
    render() {
        return (
            <div className={style.mainNavbar}>
                <HomeLogo />
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

