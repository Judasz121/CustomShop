import SortableTree, { addNodeUnderParent, removeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath, TreeItem, GetNodeKeyFunction, getNodeAtPath, SearchData, find, TreeNode, NodeData } from 'react-sortable-tree';
import React from 'react';
import 'react-sortable-tree/style.css';
import { ICategory } from '../../types/categoryTypes';
import { HomeController } from '../../router/HomeController';


type CategoriesSelectionPanelProps = {
    categoryTree: ICategory[],
    selectedCategories: string[],
    onChange: Function,
    inputName: string,
    onFinishedSelecting: Function,
    onSaveClick: Function,
}
type CategoriesSelectionPanelState = {
    treeData: TreeItem[],
    getNodeKeyFunction: GetNodeKeyFunction,
}
interface CategoryTreeNode{
    id: string,
    parentId: string,
    title: string,
    expanded: boolean,
    hasChildSelected: boolean,
    isSelected: boolean,
}

export class CategoriesSelectionPanel extends React.Component<CategoriesSelectionPanelProps, CategoriesSelectionPanelState> {
    constructor(props: CategoriesSelectionPanelProps) {
        super(props);
        console.log(this.props);
        this.state = {
            treeData: getTreeFromFlatData({
                flatData: this.props.categoryTree.map(categoryItem => {
                    let hasChildSelected = this.hasChildCategorySelected(categoryItem.id);
                    let isSelected;
                    if (hasChildSelected)
                        isSelected = true;
                    else
                        isSelected = this.isCategorySelected(categoryItem.id);

                    return (
                        {
                            title: categoryItem.name,
                            id: categoryItem.id,
                            parentId: categoryItem.parentId,
                            isSelected: isSelected,
                            hasChildSelected: hasChildSelected,
                            expanded: hasChildSelected,
                        })
                }),
                getKey: (node) => node.id,
                getParentKey: (node) => node.parentId,
                rootKey: "00000000-0000-0000-0000-000000000000",
            }),
            getNodeKeyFunction: ({ treeIndex }: { treeIndex: any }) => { return treeIndex },
        };

        this.onSelectedCategoriesChange = this.onSelectedCategoriesChange.bind(this);
        this.generateTreeNodeProps = this.generateTreeNodeProps.bind(this);
        this.isCategorySelected = this.isCategorySelected.bind(this);
        this.hasChildCategorySelected = this.hasChildCategorySelected.bind(this);
        this.updateNodeParents = this.updateNodeParents.bind(this);
    }

    onSelectedCategoriesChange(e: React.ChangeEvent<HTMLInputElement>, hasChildSelected: boolean, categoriesIdToDeselect?: string[]) {
        var categoryId = e.target.value;
        let resultData: string[] = [];
        if(this.props.selectedCategories != null)
            resultData = this.props.selectedCategories.slice();

        if (categoriesIdToDeselect != undefined)
            categoriesIdToDeselect.forEach(idItem => {
                resultData.splice(resultData.indexOf(idItem), 1);
            })

        if (e.target.checked && hasChildSelected == false) {
            resultData.push(categoryId);
            this.props.onChange(this.props.inputName, resultData);
        }
        else {
            resultData.splice(this.props.selectedCategories.indexOf(categoryId), 1)
            this.props.onChange(this.props.inputName, resultData)
        }
    }
    isCategorySelected(categoryId: string) {
        if (this.props.selectedCategories != null)
            return this.props.selectedCategories.filter((selCatItem => selCatItem == categoryId)).length > 0;
    }
    hasChildCategorySelected(categoryId: string) {
        var result = false;
        var currCatgoryId = categoryId;
        var categoriesToCheck = this.props.categoryTree.slice();

        var checkCategoryChildrenForSelection = (id: string) => {
            let currChildren = categoriesToCheck.filter(categoryItem => {
                return categoryItem.parentId == id;
            })
            currChildren.forEach((categoryItem) => {
                if (this.isCategorySelected(categoryItem.id)) {
                    result = true;
                    return result;
                }
                checkCategoryChildrenForSelection(categoryItem.id);
            })

        }
        checkCategoryChildrenForSelection(categoryId);
        return result;
    }
    updateNodeParents(childPath: string[] | number[], childValue: boolean) {

        var categoriesIdToDeselect: string[] = [];
        for (var i = 0; i < childPath.length - 1; i++) {
            let searchResult = find({
                treeData: this.state.treeData,
                getNodeKey: this.state.getNodeKeyFunction,
                searchQuery: childPath[i],
                searchMethod: (data: SearchData) => {
                    if (data.treeIndex !== null && data.treeIndex === data.searchQuery)
                        return true;
                    else
                        return false;
                }
            }).matches.filter(nodeItem => {
                if (nodeItem.treeIndex != null)
                    return true
            })[0];

            if (this.isCategorySelected(searchResult.node.id)) {
                categoriesIdToDeselect.push(searchResult.node.id)
            }
            
            this.setState(state => ({
                treeData: changeNodeAtPath({
                    path: searchResult.path,
                    getNodeKey: this.state.getNodeKeyFunction,
                    treeData: state.treeData,
                    newNode: {
                        ...searchResult.node,
                        isSelected: childValue,
                        hasChildSelected: childValue,
                        expanded: true,
                    }
                }),

            }) )
        }
        return categoriesIdToDeselect;
    }

    generateTreeNodeProps({ node, path }: { node: any, path: any }) {
        const getNodeKey = this.state.getNodeKeyFunction;
        let result =
        {
            buttons: [
                <input
                    className="selectedCategory"
                    type="checkbox"
                    onChange={(e) => {
                        var hasChildSelected = this.hasChildCategorySelected(e.target.value);
                        var isSelected: boolean = e.target.checked;
                        if (hasChildSelected)
                            isSelected = true;

                        let idsToErase = this.updateNodeParents(path, isSelected); // order of updating parent vs children first mattters
                        this.setState((state) => ({

                            treeData: changeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                                newNode: {
                                    ...node,
                                    isSelected: isSelected,
                                    hasChildSelected: hasChildSelected,
                                }
                            })
                        }))
                        
                        this.onSelectedCategoriesChange(e, hasChildSelected, idsToErase);
                    }
                    }
                    value={node.id}
                    checked={ node.isSelected }
                    disabled={node.hasChildSelected}
                />,
            ],
        };
        return result;
    }

    render() {
       
        return (
            <div style={{ height: 400 }}>
                <button className="saveButton" onClick={() => { this.props.onFinishedSelecting(this.props.selectedCategories) }}>Save & Exit</button>
                <button className="saveButton" onClick={() => { this.props.onSaveClick(this.props.selectedCategories) }}>Save</button>
                <SortableTree
                    treeData={this.state.treeData}
                    onChange={(treeData) => this.setState({ treeData: treeData })}
                    generateNodeProps={({ node, path }) => this.generateTreeNodeProps({ node, path })}
                    canDrag={false}
                />
            </div>
        );
    }
}
