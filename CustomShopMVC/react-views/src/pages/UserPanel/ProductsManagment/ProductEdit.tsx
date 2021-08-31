﻿import React from 'react';
import { CheckBoxSwitch, ImageInfoInput, ImagesInput, TextAreaInfoInput, TextInfoInput } from '../../../components/globalInputComponents';
import Constants from '../../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct, IProductEdit } from '../../../types/productTypes';
import { Link, matchPath, Redirect } from 'react-router-dom';

type ProductEditPanelProps = {
}
type ProductEditPanelState = {
    editingEnabled: boolean,
    product: IProductEdit ,
    ajaxResponse: AjaxSaveResponse,
    redirect: string,
}

type AjaxSaveResponse = {
    success: boolean,
    formError: string,
    newId: string,
    nameError: string,
}
type AjaxGetResponse = {
    product: IProduct,
    success: boolean,
}
type AjaxDeleteResponse = {
    success: boolean,
    formError:string,
}


export default class ProductEditPanel extends React.Component<ProductEditPanelProps, ProductEditPanelState> {
    constructor(props: ProductEditPanelProps) {
        super(props);
        this.state = {
            ajaxResponse: {
                success: false,
                formError: "",
                newId: "",
                nameError: "",
            },
            product: {} as IProduct,
            editingEnabled: false,
            redirect: "",
        };



        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    componentDidMount() {
        let url = Constants + "/API/UserPanel/GetProduct";
        fetch(url, {
            method: "POST",

        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    this.setState({
                        product: data.product,
                    });
                else
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            formError: "Couldn't get the product data from server",
                        },
                    });
            })
    }
    onInfoinputChange(inputName: string, value: string | number | boolean | File | File[] ) {
        let newProduct = {
            ...this.state.product,
            [inputName]: value,
        }
        this.setState({
            product: newProduct,
        });
    }
    saveProduct() {
        let url = Constants.baseUrl + "/API/UserPanel/SaveProduct";
        let dataToSend = {
            product: this.state.product,
        }
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then((data: AjaxSaveResponse) => {
                if (data.success && data.newId != null && data.newId.length > 0) {
                    this.setState({
                        product: {
                            ...this.state.product,
                            id: data.newId,
                        },
                        ajaxResponse: data,
                        editingEnabled: false,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formError: "",
                                    nameError: "",
                                }
                            });
                        }, 8000)
                    });

                }
                else if (data.success) {
                    this.setState({
                        ajaxResponse: data,
                        editingEnabled: false,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formError: "",
                                    nameError: "",
                                },
                            });
                        }, 8000);
                    }
                    );
                }
                else {
                    this.setState({
                        ajaxResponse: data,
                    });
                }

            })
    }


    deleteProduct() {
        let url = Constants.baseUrl + "/API/UserPanel/DeleteProduct";
        let dataToSend = {
            propertyId: this.state.product.id,
        }
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then((data: AjaxDeleteResponse) => {
                if (data.success) {
                    this.setState({
                        redirect: './deletedProduct',
                    })
                }
                else {
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            success: false,
                            formError: data.formError,
                        },

                    });
                }
            });

    }

    render() {
        var redirectElement;
        if (this.state.redirect.length > 0)
            redirectElement = <Redirect to={this.state.redirect} />
        else
            redirectElement = "";
        return (
            
            <div className={`ProductPanel-${this.state.product.id}`} >
                {redirectElement}
                <div className="header">
                    <h1>
                        <TextInfoInput
                            inputName="name"
                            value={this.state.product.name}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="name"
                        />
                        <span className="error">
                            {this.state.ajaxResponse.formError}
                        </span>
                    </h1>
                </div>
                <div className="content">
                    <div className="inputGroup">
                        <span>Author</span>
                        <Link to={`/user/${this.state.product.authorId}`} />
                    </div>
                    <div className="inputGroup">
                        <span>Owner</span>
                        <Link to={`/user/${this.state.product.ownerId}`} />
                    </div>
                    <div className="inputGroup">
                        <span>Description</span>
                        <TextAreaInfoInput
                            value={this.state.product.description}
                            placeholderValue=""
                            editingEnabled={true}
                            onChange={this.onInfoinputChange}
                            inputName="description"
                        />
                    </div>
                    <div className="inputGroup">
                        <span>Thumbnail Image</span>
                        <ImageInfoInput
                            inputName="newThumbnailImage"
                            onChange={this.onInfoinputChange}
                            image={this.state.product.newThumbnailImage}
                            imagePath={this.state.product.thumbnailImagePath}
                            editingEnabled={this.state.editingEnabled}
                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Images</span>
                        <ImagesInput
                            value={this.state.product.newImages}
                            onChange={this.onInfoinputChange}
                            editingEnabled={this.state.editingEnabled}
                            inputName=""
                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Quantity</span>
                        <NumberInfoInput
                            value={this.state.product.quantity}

                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Parameters</span>
                        measurableproperties and choosableProperties values
                    </div>
                </div>
                <div className="formError">
                    {this.state.ajaxResponse.formError}
                </div>
                <div className="buttonGroup">
                    <button className="" onClick={this.enableEditing}>Edit</button>
                    <button className="" onClick={this.saveProperty}>Save</button>
                    <button className="" onClick={this.deleteProperty} ><Icon.X width={25} height={25} /></button>
                </div>
            </div>


        );
    }
}