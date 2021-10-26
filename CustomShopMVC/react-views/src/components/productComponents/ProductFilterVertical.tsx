import React from "react";
import { IChoosableProperty, IMeasurableProperty } from "../../types/categoryPropertyTypes";
import { IProduct } from "../../types/productTypes";
import * as Icon from 'react-bootstrap-icons';
import { GetCategoriesCustomPropertiesResult, HomeController } from "../../router/HomeController";

//#region ProductFilterVertical
interface ProductFilterVerticalProps {
    onChange: Function,
    categoriesId: string[],
}

type ProductFilterVerticalState = {
    filterQuery: Record<string, string>,
    measurableProperties: IMeasurableProperty[],
    choosableProperties: IChoosableProperty[],
    ajaxResult: {
        formErrors: string[],
    }
}

export class ProductFilterVertical extends React.Component<ProductFilterVerticalProps, ProductFilterVerticalState>{
    constructor(props: ProductFilterVerticalProps) {
        super(props);

        this.state = {
            filterQuery: {
                price: "",
            },
            measurableProperties: [],
            choosableProperties: [],
            ajaxResult: {
                formErrors: [],
            }
        }


        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);
        this.downloadMaxPrice = this.downloadMaxPrice.bind(this);
    }

    downloadMaxPrice() {
        HomeController.GetMaxProductPriceInCategories(this.props.categoriesId);
    }
    async downloadCustomProductProperties() {
        let result: GetCategoriesCustomPropertiesResult = await HomeController.GetCategoriesCustomProperties(this.props.categoriesId);
        if (result.success)
            this.setState({
                measurableProperties: result.measurableProperties,
                choosableProperties: result.choosableProperties,
            });
        else
            this.setState({
                ajaxResult: {
                    formErrors: result.errors,
                }
            })
    }
    onFilterQueryChange() {
        this.props.onChange(this.state.filterQuery);
    }

    render() {

        return (
            <div className="ProductFilter" >
                <div className="section">
                    <header>Price</header>
                    {/*<InputRange*/}
                </div>
            </div>
        )
    }
}

// #endregion ProductFilterVertical