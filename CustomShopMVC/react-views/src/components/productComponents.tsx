import React from "react";
import { IChoosableProperty, IMeasurableProperty } from "../types/categoryPropertyTypes";
import { IProduct } from "../types/productTypes";
import * as Icon from 'react-bootstrap-icons';


// #region ProductHorizontalCard
type ProductHorizontalCardProps = {
    product: IProduct,
}
export function ProductHorizontalCard(props: ProductHorizontalCardProps) {

    return (
        <div className="ProductHorziontalCard" >
            <img className="thumbnail" src={props.product.thumbnailImagePath} />
            <div className="content" >
                <h1>{props.product.name}</h1>
                <span className="description">{props.product.description}</span>
            </div>
        </div>
    )
}
// #endregion ProductHorizontalCard

// #region ProductEditCard
type ProductEditCardProps = {
    product: IProduct,
    onDeleteClick: Function,
    onEditClick: Function,
}
export function ProductEditCard(props: ProductEditCardProps) {
    return (
        <div className="ProductHorziontalCard" >

            <img className="thumbnail" src={props.product.thumbnailImagePath} />
            <h4>{props.product.name}</h4>
            <div className="content">
                <span className="description">{props.product.description}</span>
                <button className="" onClick={() => { props.onEditClick(props.product.id) }}>Edit</button>
                <button className="" onClick={() => { props.onDeleteClick(props.product.id) }} ><Icon.Trash /></button>
            </div>
        </div>
    )
}
// #endregion ProductEditCard

//#region ProductList

interface ProductListProps {
    filterQuery: Record<string, string>,

}

type ProductListState = {
    allProducts: IProduct[],
    filteredProducts: IProduct[],
    sortQuery: Record<string, string>,
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
//#endregion ProductList

//#region ProductFilterVertical
interface ProductFilterVerticalProps {
    onChange: Function,
}

type ProductFilterVerticalState = {
    filterQuery: Record<string, string>,
    measurableProperties: IMeasurableProperty[],
    choosableProperties: IChoosableProperty[],
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
        }


        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);
        this.downloadMaxPrice = this.downloadMaxPrice.bind(this);
    }

    downloadMaxPrice() {

    }
    downloadCustomProductProperties() {
        //HomeController.GetCategoriesCustomProperties();
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