import React from 'react';
import { CheckBoxSwitch, TextInfoInput } from '../../components/globalInputComponents';
import Constants from '../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct } from '../../types/productTypes';
import { Link, matchPath } from 'react-router-dom';


type ProductsManagmentPanelProps = {

}
type ProductsManagmentPanelState = {
    ajaxResponse: ProductsManagmentPanelAjaxResponse,
    products: IProduct[],

}

type ProductsManagmentPanelAjaxResponse = {

}
type NewProductAddedFunction = (newId: string, oldId: string) => void;
type ProductDeletedFunction = (id: string) => void;
export default class ProductsManagmentPanel extends React.Component <ProductsManagmentPanelProps, ProductsManagmentPanelState>{
    constructor(props: ProductsManagmentPanelProps) {
        super(props);
        this.state = {
            ajaxResponse: {

            },
            products: []
        };
        this.productChanged = this.productChanged.bind(this);
        this.productDeleted = this.productDeleted.bind(this);
    }
    componentDidMount() {
        let dataUrl = Constants.baseUrl + "/API/UserPanel/GetProducts"
        fetch(dataUrl, {
            method: "GET",
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    ajaxResponse: data,
                });
            });
    }
    productChanged(product: IProduct) {

    }
    productDeleted(id: string) {

    }
    render() {
        return (
            <div className="productManagmentPanel" >
                <div className="productList">
                    {this.state.products.map(() => {
                        return null;
                    })}
                </div>
            </div>
        );
    }
}

