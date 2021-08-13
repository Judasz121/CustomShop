import { type } from 'os';
import React from 'react';
import { Route, Switch, BrowserRouter as Router, useRouteMatch, useParams, match, Link, RouteComponentProps, } from 'react-router-dom';
import { CategoriesManagmentPanel } from "./AdminPanel/CategoriesManagmentPanel";
import { UsersManagmentPanel } from "./AdminPanel/UsersManagmentPanel";
import { RolesManagmentPanel } from "./AdminPanel/RolesManagmentPanel";
import { SubNavMenu } from "../components/navComponents";
import Constants from "../router/constants";
import { INavItem } from "../types/navTypes";
import { useHistory, useLocation } from 'react-router';
import  CategoryPropertiesManagmentPanel   from './AdminPanel/CategoryPropertiesManagmentPanel';

interface AdminPanelPageProps extends RouteComponentProps {

}
type AdminPanelPageState = {

}
class AdminPanelPage extends React.Component<AdminPanelPageProps, AdminPanelPageState> {
    constructor(props: AdminPanelPageProps) {
        super(props);
    }
    render() {
        
        var navItems: INavItem[] = [
            { text: "Categories Panel", url: `${this.props.match.url}/categories`, },
            { text: "Users Panel", url: `${this.props.match.url}/users`, },
            {text: "Roles Panel", url: `${this.props.match.url}/roles`,},
        ]
        return (
            <div id="adminPanelPage" className="">
                <SubNavMenu navItems={navItems} />
                <Switch>
                    <Route path={`${this.props.match.url}/categories`} >
                        <CategoriesManagmentPanel />
                    </Route>
                    <Route path={`${this.props.match.url}/users`} >
                        <UsersManagmentPanel />
                    </Route>
                    <Route path={`${this.props.match.url}/roles`} >
                        <RolesManagmentPanel />
                    </Route>
                    <Route path={`${this.props.match.url}/categoryProps/:categoryId`} component={CategoryPropertiesManagmentPanel}>
                    </Route>
                </Switch>
            </div>
            
        )
    }
}

export default AdminPanelPage