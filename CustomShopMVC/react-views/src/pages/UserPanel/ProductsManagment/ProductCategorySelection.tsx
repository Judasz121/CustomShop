import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath, TreeItem } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../../router/constants';
import * as Icon from 'react-bootstrap-icons';
import { Link, useRouteMatch, RouteComponentProps, Redirect } from 'react-router-dom';
import globalStyle from "../../styles/global.module.css";


interface ProductCategorySelectionPanelProps extends RouteComponentProps<{ productId: string, } > {
    productId: string,
    redirectUrl: string,
}
type ProductCategorySelectionPanelState = {
    treeData: TreeItem[],
    selectedCategories: string[],
    iconSize: number,
    redirect: string,
    error: string,
}



export class ProductCategorySelectionPanel extends React.Component<ProductCategorySelectionPanelProps, ProductCategorySelectionPanelState> {
    constructor(props: ProductCategorySelectionPanelProps) {
        super(props);

        this.state = {
            treeData: [],
            iconSize: 30,
            selectedCategories: [],
            redirect: "",
            error: "",
        };

        this.onSelectedCategoriesChange = this.onSelectedCategoriesChange.bind(this);
        this.getTreeData = this.getTreeData.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.saveChangesAndRedirect = this.saveChangesAndRedirect.bind(this);
        this.generateTreeNodeProps = this.generateTreeNodeProps.bind(this);
    }
    componentDidMount() {
        let dataUrl = Constants.baseUrl + "/API/UserPanel/GetProductCategoriesData";
        let dataToSend = { productid: this.props.match.params.productId }
        fetch(dataUrl, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then(data => {
                if (data.success) {
                    let tree = getTreeFromFlatData({
                        flatData: data.categoryTree.map((node: any) => ({ ...node, title: node.name })),
                        getKey: (node: any) => node.id,
                        getParentKey: (node) => node.parentId,
                        rootKey: "00000000-0000-0000-0000-000000000000"
                    });
                    this.setState({
                        treeData: tree,
                    })
                }
                else
                    this.setState({
                        error: data.error,
                    })
            });
    }

    onSelectedCategoriesChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            let selCat = this.state.selectedCategories.slice();
            selCat.push(e.target.value);
            this.setState({
                selectedCategories: selCat,
            });
        }
        else {
            if (this.state.selectedCategories.length > 1)
                this.setState({
                    selectedCategories: this.state.selectedCategories.splice(this.state.selectedCategories.indexOf(e.target.value), 1),
                });
            else {
                this.setState({
                    selectedCategories: []
                })
            }
        }
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
    redirectWithoutSaving() {
        this.setState({
            redirect: "./../productEdit/" + this.props.match.params.productId,
        });
    }
    saveChangesAndRedirect() {
        this.saveChanges();
        this.setState({
            redirect: "./../productEdit/" + this.props.match.params.productId,
        });
    }
    saveChanges() {
        let dataToSend = {
            selectedCategories: this.state.selectedCategories,
            productId: this.props.match.params.productId,
        }
        let fetchUrl = Constants.baseUrl + "/API/UserPanel/SaveProductCategories"
        fetch(fetchUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("tree data saved");
                }
            })
    }

    generateTreeNodeProps ({ node, path }: { node: any, path: any }) {
        const getNodeKey = ({ treeIndex }: { treeIndex: any }) => treeIndex;
        let result =
        {
            buttons: [
                <input className="selectedCategory" type="checkbox" onChange={this.onSelectedCategoriesChange} value={node.id} />,
            ],
        };
        return result;
    }

    render() {
        var redirectComponent = null;
        if (this.state.redirect.length > 0)
            redirectComponent = <Redirect to={this.state.redirect} />
        else
            redirectComponent = "";
        return (
            <div style={{ height: 400 }}>
                {redirectComponent}
                <h1>Select product's categories</h1>
                <button className="saveButton" onClick={this.saveChanges}>Save</button>
                <button className="saveButton" onClick={this.saveChangesAndRedirect} >Save & Edit product</button>
                <SortableTree
                    treeData={this.state.treeData}
                    onChange={(treeData) => this.setState({ treeData })}
                    generateNodeProps={({ node, path }) => this.generateTreeNodeProps({ node, path })}
                    canDrag={false}
                />
            </div>
        );
    }
}



