import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import { GetAllCategoriesResult, HomeController } from '../../router/HomeController';
import { ICategory } from '../../types/categoryTypes';
import { IError } from '../../types/errorTypes';


//#region vertical

type SubcategorySelectionPanelProps = {
    parentCategoryId: string,
    onSubcategoryChosen: Function,
}

type SubcategorySelectionPanelState = {
    currCategoryPath: ICategory[],
    currSubcategories: ICategory[],
    currSelectedCategoryId: string,
    allCategories: ICategory[],
    ajaxResult: {
        errors: IError[],
    }
}

export class SubcategorySelectionPanelVertical extends React.Component<SubcategorySelectionPanelProps, SubcategorySelectionPanelState>{
    constructor(props: SubcategorySelectionPanelProps) {
        super(props);

        this.state = {
            currCategoryPath: [],
            currSubcategories: [],
            currSelectedCategoryId: this.props.parentCategoryId == undefined ? Constants.emptyGuid : this.props.parentCategoryId,
            allCategories: [],
            ajaxResult: {
                errors: [],
            }
        }

        this.onSubcategoryClick = this.onSubcategoryClick.bind(this);
        this.updateCurrCategoryPath = this.updateCurrCategoryPath.bind(this);
    }

    onSubcategoryClick(categoryId: string) {
        this.props.onSubcategoryChosen(categoryId);
        this.updateCurrCategoryPath(categoryId);
        this.setState({
            currSubcategories: this.state.allCategories.filter(categoryItem => {
                return categoryItem.parentId == categoryId;
            }),
            currSelectedCategoryId: categoryId,
        });
    }
    updateCurrCategoryPath(currCategoryId: string) {
        if (currCategoryId == "" || currCategoryId == undefined)
            currCategoryId = this.state.currSelectedCategoryId;

        let path: ICategory[] = [];
        if(currCategoryId != Constants.emptyGuid)
            path= this.getCategoryParents(currCategoryId).reverse();
        this.setState({
            currCategoryPath: path,
        })
    }
    getCategoryParents(childId: string) {
        let result: ICategory[] = [];

        let child = this.state.allCategories.filter(categoryItem => categoryItem.id == childId)[0];
        result.push(child);
        var parentId = child.parentId;

        while (parentId != Constants.emptyGuid) {
            let currCategory = this.state.allCategories.filter(categoryItem => categoryItem.id == parentId)[0];
            console.log(currCategory);
            result.push(currCategory);
            parentId = currCategory.parentId;
        }

        return result;
    }
    

    async componentDidMount() {
        let result = await HomeController.GetAllCategories();
        if (result.success) {
            this.setState({
                allCategories: result.categories,
            }, () => {
                this.setState({
                    currSubcategories: this.state.allCategories.filter(categoryItem => {
                        return categoryItem.parentId == this.state.currSelectedCategoryId;
                    })
                });
            });
        }
        else {
            this.setState({
                ajaxResult: {
                    errors: result.errors,
                }
            });
        }
    }

    render() {
        return (
            <div className="SubCategoriesSelectionPanelVertical">
                <div className="currPath">
                    <span onClick={() => {this.onSubcategoryClick(Constants.emptyGuid)}} > .. </span>
                    {this.state.currCategoryPath.map(categoryPathItemItem => {                        
                        return <span
                            className="categoryPathItem"
                            onClick={ () => {
                                    this.onSubcategoryClick(categoryPathItemItem.id);
                                }
                            }
                        >
                           / {categoryPathItemItem.name}
                        </span>
                    } ) }
                </div>
                <main>
                    <ul>
                        {this.state.currSubcategories.map(categoryItem => {
                            return (
                                <li
                                    onClick={() => {
                                        this.onSubcategoryClick(categoryItem.id);
                                    }}
                                >
                                    {categoryItem.name} 
                                </li>
                            )
                        })}
                        </ul>
                </main>
            </div>
        )
    }
}

// #endregion vertical