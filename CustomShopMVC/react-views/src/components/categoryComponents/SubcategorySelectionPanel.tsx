import React from 'react';
import 'react-sortable-tree/style.css';
import { HomeController } from '../../router/HomeController';


type SubcategorySelectionPanelVerticalProps = {
    parentCategoryId: string,
    onSubcategoryChosen: Function,
}

type SubcategorySelectionPanelVerticalState = {

}

export class SubcategorySelectionPanelVertical extends React.Component<SubcategorySelectionPanelVerticalProps, SubcategorySelectionPanelVerticalState>{
    constructor(props: SubcategorySelectionPanelVerticalProps) {
        super(props);

        this.onSubcategoryClick = this.onSubcategoryClick.bind(this);
    }

    onSubcategoryClick(categoryId: string) {
        this.props.onSubcategoryChosen(this.onSubcategoryClick(categoryId));
    }
    componentWillMount() {
        HomeController.GetCategoryChildren(this.props.parentCategoryId)
    }

    render() {


        return (
            <div className="SubCategoriesSelectionPanel">


            </div>
        )
    }
}

