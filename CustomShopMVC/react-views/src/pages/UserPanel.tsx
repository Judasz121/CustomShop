﻿import React from 'react';
import style from '../styles/userPanel.module.css';
import { INavItem } from '../types/navTypes';
import { match, Switch, Route } from 'react-router-dom';
import { SubNavMenu } from '../components/navComponents';
import AccountSettingsPanel from './UserPanel/AccountSettingsPanel';
import ProductEditPanel  from './UserPanel/ProductsManagment/ProductEdit';
import ProductsManagmentPanel from './UserPanel/ProductsManagment';

type UserPanelPageProps = {
    match: match,
}
type UserPanelPageState = {

}
export default class UserPanelPage extends React.Component <UserPanelPageProps, UserPanelPageState> {
    constructor(props: UserPanelPageProps) {
        super(props);
    }
    render() {
        var navItems: INavItem[] = [
            { text: "Settings", url: `${this.props.match.url}/settings`, },
            { text: "Your Products", url: `${this.props.match.url}/products`, },
            { text: "Your Orders", url: `${this.props.match.url}/orders`, },
            {text: "Opinions", url : `${this.props.match.url}/opinions`}
        ]
        return (
            <div className="userPanelPage">
                <SubNavMenu navItems={navItems} />

                <Switch>
                    <Route path={`${this.props.match.url}/settings`} >
                        <AccountSettingsPanel />
                    </Route>
                    <Route path={`${this.props.match.url}/products`} component={ProductsManagmentPanel} />
                    <Route path={`${this.props.match.url}/productsManagment/productEdit/:productId`} component={ProductEditPanel} />

                </Switch>
            
            </div>
        )
    }
}