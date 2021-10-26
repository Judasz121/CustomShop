import React from "react";
import { IChoosableProperty, IMeasurableProperty } from "../../types/categoryPropertyTypes";
import { IProduct } from "../../types/productTypes";
import * as Icon from 'react-bootstrap-icons';
import { GetCategoriesCustomPropertiesResult, HomeController } from "../../router/HomeController";
import { IError } from "../../types/errorTypes";




interface ProductListProps {
    filterQuery: Record<string, string>,
    categoriesId: string[],
}

type ProductListState = {
    allProducts: IProduct[],
    filteredProducts: IProduct[],
    sortQuery: Record<string, string>,
    ajaxResult: {
        formErrors: IError[],
    }
}

export class ProductList extends React.Component<ProductListProps, ProductListState>{
    constructor(props: ProductListProps) {
        super(props);

        this.downloadProducts = this.downloadProducts.bind(this);
        this.filterProducts = this.filterProducts.bind(this);
        this.sortProducts = this.sortProducts.bind(this);
    }
    getSnapshotBeforeUpdate(prevProps: ProductListProps) {
        if (prevProps.filterQuery != this.props.filterQuery)
            this.filterProducts(this.props.filterQuery);
    }

    downloadProducts() {
        HomeController.GetAllProducts().then(result => result)
            .then(result => {
                this.setState({
                    allProducts: result.products,
                })
            })
    }
    filterProducts(filterQuery: Record<string, string>) {
        if (filterQuery == null || filterQuery == undefined)
            filterQuery = this.props.filterQuery;
    }
    sortProducts(sortQuery: Record<string, string>) {
        if (sortQuery == undefined || sortQuery == null)
            sortQuery = this.state.sortQuery;
    }

    render() {

        return (
            <div className="ProductList" >

            </div>
        )
    }
}
