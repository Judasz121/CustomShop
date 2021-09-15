import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath, TreeItem } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../../router/constants';
import * as Icon from 'react-bootstrap-icons';
import { Link, useRouteMatch, RouteComponentProps, Redirect } from 'react-router-dom';
import globalStyle from "../../styles/global.module.css";
import { StaticContext } from 'react-router';
import { ICategory } from '../../../types/categoryTypes';

//interface ProductCategorySelectionPanelProps extends RouteComponentProps<{ productId: string }, StaticContext, { returnUrl: string }> {
type ProductCategorySelectionPanelProps = {
    categoryTree: ICategory[],
    selectedCategories: string[],
    onChange: Function,
    inputName: string,
    onFinishedSelecting: Function,
    onSaveClick: Function,
}
type ProductCategorySelectionPanelState = {
    treeData: TreeItem[],
    //selectedCategories: string[],
    error: string,
}



export class ProductCategorySelectionPanel extends React.Component<ProductCategorySelectionPanelProps, ProductCategorySelectionPanelState> {
    constructor(props: ProductCategorySelectionPanelProps) {
        super(props);

        this.state = {
            treeData: this.props.categoryTree,
           // selectedCategories: [],
            error: "",
        };

        this.onSelectedCategoriesChange = this.onSelectedCategoriesChange.bind(this);
        this.generateTreeNodeProps = this.generateTreeNodeProps.bind(this);
    }

    //onSelectedCategoriesChange(e: React.ChangeEvent<HTMLInputElement>) {
    //    if (e.target.checked) {
    //        let resultData = this.state.selectedCategories.slice();
    //        resultData.push(e.target.value);
    //        this.setState({
    //            selectedCategories: resultData,
    //        });
    //        this.props.onChange(this.props.inputName, resultData);
    //    }
    //    else {
    //        if (this.state.selectedCategories.length > 1) {
    //            let resultData = this.state.selectedCategories.splice(this.state.selectedCategories.indexOf(e.target.value), 1)
    //            this.setState({
    //                selectedCategories: resultData,
    //            });
    //            this.props.onChange(this.props.inputName, resultData)
    //        }
    //        else {
    //            this.setState({
    //                selectedCategories: []
    //            });
    //            this.props.onChange(this.props.inputName, []);
    //        }
    //    }
    //}

    onSelectedCategoriesChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            let resultData = this.props.selectedCategories.slice();
            resultData.push(e.target.value);

            this.props.onChange(this.props.inputName, resultData);
        }
        else {
            if (this.props.selectedCategories.length > 1) {
                let resultData = this.props.selectedCategories.splice(this.props.selectedCategories.indexOf(e.target.value), 1)

                this.props.onChange(this.props.inputName, resultData)
            }
            else {

                this.props.onChange(this.props.inputName, []);
            }
        }
    }



    generateTreeNodeProps ({ node, path }: { node: any, path: any }) {
        const getNodeKey = ({ treeIndex }: { treeIndex: any }) => treeIndex;
        let result =
        {
            buttons: [
                <input className="selectedCategory" type="checkbox" onChange={this.onSelectedCategoriesChange} value={node.id} checked={node.checked} />,
            ],
        };
        return result;
    }

    render() {
       
        return (
            <div style={{ height: 400 }}>
                <button className="saveButton" onClick={this.props.onFinishedSelecting(this.props.selectedCategories)}>Save & Exit</button>
                <button className="saveButton" onClick={this.props.onSaveClick(this.props.selectedCategories)}>Save</button>

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



