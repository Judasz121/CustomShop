import React from 'react';
import { CheckBoxSwitch, TextInfoInput } from '../../components/globalInputComponents';
import Constants from '../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct } from '../../types/productTypes';
import { Link, matchPath, Redirect } from 'react-router-dom';
import { ProductEditCard, ProductHorizontalCard } from '../../components/globalComponents';


type ProductsManagmentPanelProps = {

}
type ProductsManagmentPanelState = {
    ajaxResponse: ProductsManagmentPanelAjaxResponse,
    products: IProduct[],
    addNewProduct: boolean,
}

type ProductsManagmentPanelAjaxResponse = {
    success: boolean | null,
    formErrors: string[],
    nameErrors: string[],
}
type NewProductAddedFunction = (newId: string, oldId: string) => void;
type ProductDeletedFunction = (id: string) => void;
export default class ProductsManagmentPanel extends React.Component <ProductsManagmentPanelProps, ProductsManagmentPanelState>{
    constructor(props: ProductsManagmentPanelProps) {
        super(props);
        this.state = {
            ajaxResponse: {
                success: null,
                formErrors: [],
                nameErrors: [],
            },
            products: [],
            addNewProduct: false,
        };
        this.addProduct = this.addProduct.bind(this);
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
    addProduct() {
        this.setState({
            addNewProduct: true,
        })
    }
    deleteProduct(id: string) {
        let url = Constants.baseUrl + "/API/UserPanel/DeleteProduct";
        let dataToSend = {
            productId: id,
        };
        fetch(url, {
            method: "POST",
            body: JSON.stringify(dataToSend),
            headers: {
                'content-type': 'application/json',
            }
        })
            .then((response) => { return response.json() })
            .then((data: ProductsManagmentPanelAjaxResponse) => {
                if (data.success)
                    this.setState({
                        ajaxResponse: data,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formErrors: [],
                                }
                            })
                        });
                    }
                    )
                else
                    this.setState({
                        ajaxResponse: data,
                    })
            })
        ;
    }

    render() {
        var content;
        if (this.state.addNewProduct == true)
            content = <Redirect to="./productsManagment/productEdit/:new" />
        else
            content = this.state.products.map((item) => {
                return <ProductEditCard product={item} onDeleteClick={this.deleteProduct}/>
            })
        return (
            <div className="productManagmentPanel" >
                <button className="" onClick={this.addProduct}>New Product</button>
                <div className="productList">
                    {content}
                </div>
            </div>
        );
    }
}

