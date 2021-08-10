import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import { Router as BrowserRouter, Link, Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import { TextInfoInput, CheckBoxInfoInput } from '../../components/globalInputComponents';
import { type } from 'os';
import { IUser } from '../../types/authTypes';

// #region typescripted categoriesManagmentComponents
/*
export class CategoriesManagmentPanel extends React.Component {
    treeRef: React.RefObject<CategoryTree>;
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.saveTreeChanges = this.saveTreeChanges.bind(this);
        this.treeRef = React.createRef();
    }
    saveTreeChanges() {
        let data = this.treeRef.current?.getTreeData();
        let dataObject = { "categories": data };
        let fetchUrl = Constants.baseUrl + "/API/AdminPanel/InsertCategoryTree"
        fetch(fetchUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataObject),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("tree data saved");
                }

            })
    }
    render() {
        return (
            <div id="CategoryManagmentPanel" >
                <CategoryTree ref={this.treeRef} />
                <button onClick={this.saveTreeChanges} className="saveChanges">
                    Save changes
                </button>
            </div>
        )
    }
}
type CategoryTreeProps = {

}
type CategoryTreeState = {
    treeData: Array<{}>,
    addAsFirstChild: boolean,
    newNodeKey: number
}

class CategoryTree extends React.Component<CategoryTreeProps, CategoryTreeState> {
    constructor(props: CategoryTreeProps) {
        super(props);

        this.state = {
            treeData: [],
            addAsFirstChild: true,
            newNodeKey: 1,
        };
    }
    componentDidMount() {
        let dataUrl = Constants.baseUrl + "/API/AdminPanel/GetCategoryTree";
        fetch(dataUrl, {
            method: "GET",
        })
            .then((response) => response.json())
            .then(data => {
                let tree = getTreeFromFlatData({
                    flatData: data.categoryTreeData.map((node: any) => ({ ...node, title: node.name })),
                    getKey: (node: any) => node.id,
                    getParentKey: (node: any) => node.parentId,
                    rootKey: "00000000-0000-0000-0000-000000000000"
                });
                this.setState({
                    treeData: tree
                })
                this.forceUpdate();
            });
    }
    getTreeData() {
        const flatData = getFlatDataFromTree({
            treeData: this.state.treeData,
            getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
            ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
        }).map(({ node, path }) => ({
            id: String(node.id),
            name: node.name,

            // The last entry in the path is this node's key
            // The second to last entry (accessed here) is the parent node's key
            parentId: path.length > 1 ? String(path[path.length - 2]) : null,
        }));
        return flatData;
    }

    generateTreeNodeProps({ node, path }: { node: any, path: number[] | string[] }) {
        const getNodeKey = ({ treeIndex }: { treeIndex: number }) => treeIndex;
        let result =
        {
            buttons: [
                <button
                    onClick={() => {
                        this.setState((state) => ({
                            treeData: addNodeUnderParent({
                                treeData: state.treeData,
                                parentKey: path[path.length - 1],
                                expandParent: true,
                                newNode: {
                                    name: "new category",
                                    key: this.state.newNodeKey
                                },
                                addAsFirstChild: state.addAsFirstChild,
                                getNodeKey,
                            }).treeData,
                        }));
                        this.setState({
                            newNodeKey: this.state.newNodeKey + 1
                        });
                    }}

                >
                    Add subcategory
                </button>,
                <button
                    onClick={() => {
                        this.setState((state) => ({
                            treeData: removeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                            })
                        }));
                    }}
                >
                    Remove
                </button>,
            ],
            title: (
                <input
                    style={{ fontSize: "1rem" }}
                    value={node.name}
                    onChange={(event) => {
                        const name = event.target.value;

                        this.setState((state) => ({
                            treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: { ...node, name },
                            }),
                        }));
                    }}
                />
            ),
        };
        return result;
    }

    render() {
        // const getNodeKey = ({ treeIndex }) => treeIndex;
        return (
            <div style={{ height: 400 }}>
                <SortableTree
                    treeData={this.state.treeData}
                    onChange={(treeData) => this.setState({ treeData })}
                    generateNodeProps={({ node, path }) => this.generateTreeNodeProps({ node, path })}

                />
            </div>
        );
    }
}

*/
// #endregion

type UserManagmentPanelProps = {

}
type UserManagmentPanelState = {
    users: IUser[],
    editingEnabled: boolean,
    newUserId: number,
}



export class UsersManagmentPanel extends React.Component<UserManagmentPanelProps, UserManagmentPanelState> {
    constructor(props: UserManagmentPanelProps) {
        super(props);

        this.state = {
            users: [],
            editingEnabled: false,
            newUserId: 0
        }
        this.addNewUser = this.addNewUser.bind(this);
        this.newUserAdded = this.newUserAdded.bind(this);
        this.userEdited = this.userEdited.bind(this);
    }

    componentDidMount() {

        let dataUrl = Constants.baseUrl + "/API/AdminPanel/GetUsers";
        fetch(dataUrl, {
            method: "GET",

        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    users: data.users
                });

            })
    }

    userEdited(target: IUser) {

        this.setState((state) => {
            var newUsers = state.users.map((item) => {
                if (item.id == target.id)
                    return target;
                else
                    return item;
            });
            return {
                users: newUsers,
            }
        });
    }

    addNewUser() {
        let user : IUser = {
            id: "new" + this.state.newUserId,
            userName: "new user",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            emailConfirmed: false,
            lock: false,
        }

        this.setState({
            newUserId: this.state.newUserId + 1,
            users: [user, ...this.state.users],
        });
    }

    newUserAdded(newUserNewId: string, newUserOldId: string) {
        this.setState((state) => {
            var newUsers = state.users.map((item) => {
                if (item.id == newUserOldId)
                    item.id = newUserNewId;
                return item;
            });
            alert("New user added.");
            return {
                users: newUsers,
            }
        })
    }
    render() {
        return (
            <div id="UserManagmentPanel" >
                <div className="UsersPanelList">
                    <div className="addUserContainer">
                        <button className="" onClick={this.addNewUser}>New User</button>
                    </div>
                    {
                        this.state.users.map((item, index) => {
                            return <UserInfoEditPanel userEdited={this.userEdited} newUserAdded={this.newUserAdded} key={item.id} user={item} />
                        })
                    }
                </div>
            </div>
        )
    }
}
type UserInfoEditPanelProps = {
    user: {
        id: string,
        userName: string,
        email: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        emailConfirmed: boolean,
        lock: boolean,
    },
    newUserAdded: Function,
    userEdited: Function,
}
type UserInfoEditPanelState = {
    editedData: {
        userName: string,
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        lock: boolean,
        emailConfirmed: boolean,
    }
    editingEnabled: boolean,
    saveResponse: {
        newUserId: string,
        userNameError: string,
        emailError: string,
        phoneNumberError: string,
        formError: string,
        success: boolean,
    }
}



export class UserInfoEditPanel extends React.Component<UserInfoEditPanelProps, UserInfoEditPanelState>  {
    constructor(props: UserInfoEditPanelProps) {
        super(props);
        this.state = {
            editedData: {
                userName: props.user.userName,
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                email: props.user.email,
                phoneNumber: props.user.phoneNumber,
                lock: props.user.lock,
                emailConfirmed: props.user.emailConfirmed,
            },
            editingEnabled: false,
            saveResponse: {
                newUserId: "",
                userNameError: "",
                emailError: "",
                phoneNumberError: "",
                formError: "",
                success: false,
            }
        }
        if (this.props.user.id.includes("new")) {
            this.state = {
                ...this.state,
                editingEnabled: true
            };
        }

        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.enableEditing = this.enableEditing.bind(this);
    }

    enableEditing() {
        this.setState({
            editingEnabled: true,
        })
    }

    saveUser() {
        let saveUrl = Constants.baseUrl + "/API/AdminPanel/SaveUser";
        let dataToSend: Record<string, any> = {}
        dataToSend = this.state.editedData;
        dataToSend.id = this.props.user.id;
                
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
                        }
                    });
                    if (!(data.newUserId != "" && typeof data.newUserId != "undefined" && data.newUserId != null)) {
                        alert("saved changes");
                    }
                    else {
                        this.props.newUserAdded(data.newUserId, this.props.user.id);
                    }

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
                            userNameError: data.userNameError,
                            emailError: data.emailError,
                            formError: data.formError,
                            phoneNumberError: data.phoneNumberError
                        }
                    });
                }
            });
    }

    onInfoinputChange(inputName: string, value: string | boolean | number) {
        console.log(inputName + " changed to ");
        console.log(value);
        this.setState({
            editedData: {
                ...this.state.editedData,
                [inputName]: value,
            }
        })
                
        let editedUser: IUser = {
            ...this.state.editedData,
            id: this.props.user.id,
            [inputName]: value,
        }
        this.props.userEdited(editedUser);
    }

    render() {
        return (
            <div className={`UserPanel-${this.props.user.id}`} >
                <div className="header">
                    <h1>
                        <TextInfoInput
                            inputName="userName"
                            value={this.props.user.userName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="user login"
                        />
                        <span className="error">
                            {this.state.saveResponse.formError}
                            {this.state.saveResponse.userNameError}
                        </span>
                    </h1>
                    <h2>
                        <TextInfoInput
                            inputName="firstName"
                            value={this.props.user.firstName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="first name"
                        />
                        <TextInfoInput
                            inputName="lastName"
                            value={this.props.user.lastName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="last name"
                        />
                    </h2>
                </div>
                <div className="content">
                    <div className="inputGroup email">
                        <span>E-mail</span>
                        <TextInfoInput
                            inputName="email"
                            value={this.props.user.email}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="e-mail"
                        />
                        <span className="error">
                            {this.state.saveResponse.emailError}
                        </span>
                    </div>
                    <div className="inputGroup phone">
                        <span>Phone number</span>
                        <TextInfoInput
                            inputName="phoneNumber"
                            value={this.props.user.phoneNumber}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="phone number"
                        />
                        <span className="error">
                            {this.state.saveResponse.phoneNumberError}
                        </span>
                    </div>
                    <div className="inputGroup lock">
                        <CheckBoxInfoInput
                            inputName="lock"
                            value={this.props.user.lock}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            label="Is Locked"
                        />
                    </div>
                    <div className="inputGroup emailConfirmed">
                        <CheckBoxInfoInput
                            inputName="emailConfirmed"
                            value={this.props.user.emailConfirmed}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            label="Confirmed E-mail"
                        />
                    </div>
                </div>
                <div className="formError">
                    {this.state.saveResponse.formError}
                </div>
                <button className="" onClick={this.enableEditing}>Edit</button>
                <button className="" onClick={this.saveUser}>Save</button>
            </div>
        )
    }
}

