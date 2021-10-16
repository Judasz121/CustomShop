import React from "react";
import { IChoosableProperty, IMeasurableProperty } from "../../types/categoryPropertyTypes";
import { IProduct } from "../../types/productTypes";
import * as Icon from 'react-bootstrap-icons';
import { GetCategoriesCustomPropertiesResult, HomeController } from "../../router/HomeController";



type ProductHorizontalCardProps = {
    product: IProduct,
}
export function ProductHorizontalCard(props: ProductHorizontalCardProps) {

    return (
        <div className="ProductHorziontalCard" >
            <img className="thumbnail" src={props.product.thumbnailImagePath} />
            <div className="content" >
                <h1>{props.product.name}</h1>
                <span className="price">{props.product.price}</span>
                <span className="description">{props.product.description}</span>
            </div>
        </div>
    )
}

