import React from 'react';
import { CheckBoxSwitch, TextInfoInput } from '../../components/globalInputComponents';
import Constants from '../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct } from '../../types/productTypes';
import { Link, matchPath, Redirect } from 'react-router-dom';
import { ProductEditCard } from '../../components/productComponents';


type ProductsManagmentPanelProps = {

}
type ProductsManagmentPanelState = {
    ajaxResponse: ProductsManagmentPanelAjaxResponse,
    products: IProduct[],
    redirect: string,
}

type ProductsManagmentPanelAjaxResponse = {
    success: boolean | null,
    formErrors: string[],
    nameErrors: string[],
}
type NewProductAddedFunction = (newId: string, oldId: string) => void;
type ProductDeletedFunction = (id: string) => void;
export default class ProductsManagmentPanel extends React.Component<ProductsManagmentPanelProps, ProductsManagmentPanelState>{
    constructor(props: ProductsManagmentPanelProps) {
        super(props);
        this.state = {
            ajaxResponse: {
                success: null,
                formErrors: [],
                nameErrors: [],
            },
            products: [],
            redirect: '',
        };
        this.addProduct = this.addProduct.bind(this);
        this.onProductEditClick = this.onProductEditClick.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
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
                    products: data.products,
                });
            });
    }

    addProduct() {
        this.setState({
            redirect: "./products/productEdit/new",
        })
    }
    onProductEditClick(id: string) {
        this.setState({
            redirect: "./products/productEdit/" + id,
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
                if (data.success) {
                    
                    let deletedProduct: IProduct = this.state.products.filter(productItem => {
                        return productItem.id == id ? true : false;
                    })[0];
                    let newProducts = this.state.products.slice();
                    newProducts.splice(this.state.products.indexOf(deletedProduct), 1)

                    this.setState({
                        ajaxResponse: data,
                        products: newProducts,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formErrors: [],
                                },
                            })
                        });
                    }
                    );
                }
                else
                    this.setState({
                        ajaxResponse: data,
                    })
            })
        ;
    }

    render() {
        var content;
        if (this.state.redirect.length > 0)
            content = <Redirect push to={this.state.redirect} />
        else
            content = this.state.products.map((item) => {
                return <ProductEditCard product={item} onDeleteClick={this.deleteProduct} onEditClick={this.onProductEditClick}/>
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

