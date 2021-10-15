import React from 'react';
import { Filter } from 'react-bootstrap-icons';
import { RouteComponentProps } from 'react-router-dom';
import { SubcategorySelectionPanelVertical } from '../components/categoryComponents/SubcategorySelectionPanel';
import { ProductFilterVertical } from './../components/productComponents/ProductFilterVertical';
import { ProductList } from './../components/productComponents/ProductList';
interface HomePageProps extends RouteComponentProps {

}
type HomePageState = {
    productFilterQuery: Record<string, string>,
    currCategoriesId: string[],
}
class HomePage extends React.Component<HomePageProps, HomePageState> {
    constructor(props: HomePageProps) {
        super(props);

        this.state = {
            productFilterQuery: {} as Record<string, string>,
            currCategoriesId: [],
        }

        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);
        this.onNewSubcategoryChosen = this.onNewSubcategoryChosen.bind(this);
    }

    onFilterQueryChange(filterQuery: Record<string, string>) {
        this.setState({
            productFilterQuery: filterQuery,
        });
    }
    onNewSubcategoryChosen(categoryId: string) {
        this.setState({
            currCategoriesId: [categoryId],
        })
    }

    render() {
        return (
            <div id="homePage">
                <SubcategorySelectionPanelVertical
                    parentCategoryId={
                        this.state.currCategoriesId[0]
                    }
                    onSubcategoryChosen={this.onNewSubcategoryChosen}
                />
                <ProductFilterVertical onChange={this.onFilterQueryChange} categoriesId={ this.state.currCategoriesId } />
                <ProductList filterQuery={this.state.productFilterQuery} />
            </div>
        )
    }
}
export default HomePage