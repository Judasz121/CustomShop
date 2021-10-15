import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import * as Icon from 'react-bootstrap-icons';
import { Link, useRouteMatch } from 'react-router-dom';
import globalStyle from "../../styles/global.module.css";


export class CategoriesManagmentPanel extends React.Component {
    constructor(props) {
        super(props);

        this.saveTreeChanges = this.saveTreeChanges.bind(this);
        this.treeRef = React.createRef();
    }
    saveTreeChanges() {
        let data = this.treeRef.current.getTreeData();
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


class CategoryTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [],
            addAsFirstChild: true,
            newNodeKey: 1,
            iconSize: 30,
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
                    flatData: data.categoryTreeData.map((node) => ({ ...node, title: node.name })),
                    getKey: (node) => node.id,
                    getParentKey: (node) => node.parentId,
                    rootKey: "00000000-0000-0000-0000-000000000000"
                });
                this.state.treeData = tree;
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

    generateTreeNodeProps({ node, path }) {
        const getNodeKey = ({ treeIndex }) => treeIndex;
        let result =
        {
            buttons: [
                <button
                    className={globalStyle.decorationNone + " " + globalStyle.button}
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
                        this.state.newNodeKey++;
                    }}

                >
                    Add subcategory
                </button>,
                <button
                    title="Delete"
                    className={globalStyle.decorationNone}
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
                    <Icon.X color="red" size={this.state.iconSize} />
                </button>,
                <Link to={"./categoryProps/" + node.id} className={globalStyle.decorationNone} >
                    <button className={globalStyle.decorationNone + " " + globalStyle.button}>
                        Edit props
                    </button>
                </Link>
                
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



