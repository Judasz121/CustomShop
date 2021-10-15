import React from 'react';
import { Filter } from 'react-bootstrap-icons';
import { RouteComponentProps } from 'react-router-dom';
import { SubcategorySelectionPanelVertical } from '../components/categoryComponents';
import { ProductFilterVertical, ProductList } from './../components/productComponents';
interface HomePageProps extends RouteComponentProps {

}
type HomePageState = {
    productFilterQuery: Record<string, string>,
    currCategoryId: string,
}
class HomePage extends React.Component<HomePageProps, HomePageState> {
    constructor(props: HomePageProps) {
        super(props);

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
            currCategoryId: categoryId,
        })
    }

    render() {
        return (
            <div id="homePage">
                <SubcategorySelectionPanelVertical parentCategoryId={this.state.currCategoryId} onSubcategoryChosen={this.onNewSubcategoryChosen} />
                <ProductFilterVertical onChange={this.onFilterQueryChange} />
                <ProductList filterQuery={this.state.productFilterQuery} />
            </div>
        )
    }
}
export default HomePage