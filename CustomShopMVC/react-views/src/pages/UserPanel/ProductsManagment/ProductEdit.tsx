import React from 'react';
import { CheckBoxSwitch, ImageInfoInput, ImagesInput, NumberInfoInput, TextAreaInfoInput, TextInfoInput } from '../../../components/globalInputComponents';
import Constants from '../../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct, IProductEdit } from '../../../types/productTypes';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import { IUser } from '../../../types/authTypes';

interface ProductEditPanelProps extends RouteComponentProps<{ productId: string }>{

}
type ProductEditPanelState = {
    product: IProductEdit ,
    ajaxResponse: AjaxSaveResponse,
    redirect: string,
    editingEnabled: boolean,
    users: IUser[],
}

type AjaxSaveResponse = {
    success: boolean,
    formErrors: string[],
    newId: string,
    nameErrors: string[],
}


export default class ProductEditPanel extends React.Component<ProductEditPanelProps, ProductEditPanelState> {
    constructor(props: ProductEditPanelProps) {
        super(props);
        this.state = {
            ajaxResponse: {
                success: false,
                formErrors: [],
                newId: "",
                nameErrors: [],
            },
            users: [],
            product: {} as IProductEdit,
            redirect: "",
            editingEnabled: true,
        };



        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    componentDidMount() {
        // #region get product
        if (!this.props.match.params.productId.includes("new"))
        {
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
                            ajaxResponse: data,
                        });
                })
        }
        //#endregion
        //#region get users
        let url = Constants.baseUrl + "/API/UserPanel/GetUsers"
        fetch(url, {
            method: "GET",

        })
            .then(response => response.json())
            .then(data => {
                if(data.success)
                this.setState({
                    users: data.users
                })
                else
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            formErrors: data.formErrors,
                        }
                    })
            })

        //#endregion
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
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formErrors: [],
                                    nameErrors: [],
                                }
                            });
                        }, 8000)
                    });

                }
                else if (data.success) {
                    this.setState({
                        ajaxResponse: data,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ajaxResponse: {
                                    ...this.state.ajaxResponse,
                                    formErrors: [],
                                    nameErrors: [],
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
            .then((data) => {
                if (data.success) {
                    this.setState({
                        redirect: './deletedProduct',
                    })
                }
                else {
                    this.setState({
                        ajaxResponse: data,

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
                            {this.state.ajaxResponse.formErrors.map((item) => { return item + "\n" })}
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
                            editingEnabled={this.state.editingEnabled}
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
                            inputName="newImages"
                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Quantity</span>
                        <NumberInfoInput
                            value={this.state.product.quantity}
                            onChange={this.onInfoinputChange}
                            editingEnabled={this.state.editingEnabled}
                            inputName="quantity"
                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Parameters</span>
                        measurableproperties and choosableProperties values
                    </div>
                </div>
                <div className="formError">
                    {this.state.ajaxResponse.formErrors.map((item) => { return item + "\n" })}
                </div>
                <div className="buttonGroup">
                    <button className="" onClick={() => { this.setState({ editingEnabled: true, }) } }>Edit</button>
                    <button className="" onClick={this.saveProduct}>Save</button>
                    <button className="" onClick={this.deleteProduct} ><Icon.X width={25} height={25} /></button>
                </div>
            </div>


        );
    }
}