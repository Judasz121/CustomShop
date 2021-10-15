import React from 'react';
import AppRouter from "../../router";
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch } from "react-router-dom";
import Constants from '../../router/constants';
import style from "../../styles/nav.module.css";
import globalStyle from "../../styles/global.module.css";
import { INavItem } from '../../types/navTypes';
import * as Icon from 'react-bootstrap-icons'

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