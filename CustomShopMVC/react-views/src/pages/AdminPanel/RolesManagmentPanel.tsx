import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import { Router as BrowserRouter, Link, Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import { type } from 'os';
import { IRole } from '../../types/authTypes';
import { TextInfoInput } from '../../components/inputComponents/Text';


type RolesManagmentPanelProps = {

}
type RolesManagmentPanelState = {
    roles: IRole[],
    editingEnabled: boolean,
    newRoleId: number,
}



export class RolesManagmentPanel extends React.Component<RolesManagmentPanelProps, RolesManagmentPanelState> {
    constructor(props: RolesManagmentPanelProps) {
        super(props);

        this.state = {
            roles: [],
            editingEnabled: false,
            newRoleId: 0
        }
        this.addNewRole = this.addNewRole.bind(this);
        this.newRoleAdded = this.newRoleAdded.bind(this);
        this.roleEdited = this.roleEdited.bind(this);
    }

    componentDidMount() {

        let dataUrl = Constants.baseUrl + "/API/AdminPanel/GetRoles";
        fetch(dataUrl, {
            method: "GET",

        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roles: data.roles
                });

            })
    }

    roleEdited(target: IRole) {

        this.setState((state) => {
            var newRoles = state.roles.map((item) => {
                if (item.id == target.id)
                    return target;
                else
                    return item;
            });
            return {
                roles: newRoles,
            }
        });
    }

    addNewRole() {
        let role : IRole = {
            id: "new" + this.state.newRoleId,
            name: "new role",
        }

        this.setState({
            newRoleId: this.state.newRoleId + 1,
            roles: [role, ...this.state.roles],
        });
    }

    newRoleAdded(newRoleNewId: string, newRoleOldId: string) {
        this.setState((state) => {
            var newRoles = state.roles.map((item) => {
                if (item.id == newRoleOldId)
                    item.id = newRoleNewId;
                return item;
            });
            return {
                roles: newRoles,
            }
        })
    }
    render() {
        return (
            <div id="RoleManagmentPanel" >
                <div className="RolesPanelList">
                    <div className="addRoleContainer">
                        <button className="" onClick={this.addNewRole}>New Role</button>
                    </div>
                    {
                        this.state.roles.map((item, index) => {
                            return <RoleInfoEditPanel roleEdited={this.roleEdited} newRoleAdded={this.newRoleAdded} key={item.id} role={item} />
                        })
                    }
                </div>
            </div>
        )
    }
}
type RoleInfoEditPanelProps = {
    role: {
        id: string,
        name: string,
    },
    newRoleAdded: Function,
    roleEdited: Function,
}
type RoleInfoEditPanelState = {
    editedData: {
        name: string,
    }
    editingEnabled: boolean,
    saveResponse: {
        newRoleId: string,
        roleNameError: string,
        formError: string,
        success: boolean,
    }
}



export class RoleInfoEditPanel extends React.Component<RoleInfoEditPanelProps, RoleInfoEditPanelState>  {
    constructor(props: RoleInfoEditPanelProps) {
        super(props);

        this.state = {
            editedData: {
                name: props.role.name,
            },
            editingEnabled: false,
            saveResponse: {
                newRoleId: "",
                roleNameError: "",
                formError: "",
                success: false,
            }
        }
        if (this.props.role.id.includes("new")) {
            this.state = {
                ...this.state,
                editingEnabled: true
            };
        }

        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.enableEditing = this.enableEditing.bind(this);
    }

    enableEditing() {
        this.setState({
            editingEnabled: true,
        })
    }

    saveRole() {
        let saveUrl = Constants.baseUrl + "/API/AdminPanel/SaveRole";
        let dataToSend: Record<string, any> = {}
        dataToSend = this.state.editedData;
        dataToSend.id = this.props.role.id;

        fetch(saveUrl, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        editingEnabled: false,
                        saveResponse: {
                            ...this.state.saveResponse,
                            formError: "Successfully saved",
                        }
                    });

                    if (data.newRoleId != "" && typeof data.newRoleId != "undefined" && data.newRoleId != null)
                        this.props.newRoleAdded(data.newRoleId, this.props.role.id);

                    setTimeout(() => {
                        this.setState({
                            saveResponse: {
                                ...this.state.saveResponse,
                                formError: "",
                            }
                        });
                    }, 8000)
                }
                else {
                    this.setState({
                        editingEnabled: true,
                        saveResponse: {
                            ...this.state.saveResponse,
                            roleNameError: data.roleNameError,
                            formError: data.formError,
                        }
                    });
                }
            });
    }

    onInfoinputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let inputName = e.target.name;
        let value = e.target.value;
        this.setState({
            editedData: {
                ...this.state.editedData,
                [inputName]: value,
            }
        });
        let editedRole: IRole = {
            ...this.state.editedData,
            id: this.props.role.id,
            [inputName]: value,
        };
        this.props.roleEdited(editedRole);
    }

    render() {
        return (
            <div className={`RolePanel-${this.props.role.id}`} >
                <div className="header">
                    <h1>
                        <TextInfoInput
                            inputName="name"
                            value={this.props.role.name}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="role login"
                        />
                        <span className="error">
                            {this.state.saveResponse.formError}
                        </span>
                    </h1>
                </div>
                <div className="content">
                    {/*<div className="inputGroup email">*/}
                    {/*    <span>E-mail</span>*/}
                    {/*    <TextInfoInput*/}
                    {/*        inputName="email"*/}
                    {/*        value={this.props.role.email}*/}
                    {/*        editingEnabled={this.state.editingEnabled}*/}
                    {/*        onChange={this.onInfoinputChange}*/}
                    {/*        placeholderValue="e-mail"*/}
                    {/*    />*/}
                    {/*    <span className="error">*/}
                    {/*        {this.state.saveResponse.emailError}*/}
                    {/*    </span>*/}
                    {/*</div>*/}
                </div>
                <div className="formError">
                    {this.state.saveResponse.formError}
                </div>
                <button className="" onClick={this.enableEditing}>Edit</button>
                <button className="" onClick={this.saveRole}>Save</button>
            </div>
        )
    }
}

