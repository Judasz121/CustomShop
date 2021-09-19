import React from 'react';
import { CheckBoxSwitch, ImageInfoInput, ImagesInput, NumberInfoInput, TextAreaInfoInput, TextInfoInput } from '../../../components/globalInputComponents';
import Constants from '../../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';
import { IProduct, IProductEdit } from '../../../types/productTypes';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import ReactSelect from 'react-select';
import { IUser } from '../../../types/authTypes';
import { StaticContext } from 'react-router';
import { Location } from 'history';
import { PopupWindow } from '../../../components/globalComponents';
import { ProductCategorySelectionPanel } from './ProductCategorySelection';
import { ICategory } from '../../../types/categoryTypes';
import { IChoosableProperty, IMeasurableProperty } from '../../../types/categoryPropertyTypes';

interface ProductEditPanelProps extends RouteComponentProps<{ productId: string }, StaticContext, { selectedCategories: string[] } >{

}
type ProductEditPanelState = {
    product: IProductEdit ,
    ajaxResponse: AjaxSaveResponse,
    redirect: string,
    editingEnabled: boolean,

    users: IUser[],
    usersReactSelectItems: ReactSelectItem[],

    categoryTree: ICategory[],
    categoriesWindowVisible: boolean,
    selectedCategories: string[],

    choosableProperties: IChoosableProperty[],
    measurableProperties: IMeasurableProperty[],
}
type AjaxSaveResponse = {
    success: boolean,
    formError: string,
    newId: string,
    nameError: string,
}

type ReactSelectItem = { label: string, value: string, }

export default class ProductEditPanel extends React.Component<ProductEditPanelProps, ProductEditPanelState> {
    constructor(props: ProductEditPanelProps) {
        super(props);

        if ( this.props.location.state != undefined) {
            console.log(this.props.location.state);
        }

        let showCategoriesWindow: boolean = false;
        if (this.props.match.params.productId == "new")
            showCategoriesWindow = true;

        this.state = {
            ajaxResponse: {
                success: false,
                formError: "",
                newId: "",
                nameError: "",
            },
            
            product: {} as IProductEdit,
            redirect: "",
            editingEnabled: true,

            usersReactSelectItems: [],
            users: [],

            categoryTree: [],
            categoriesWindowVisible: showCategoriesWindow,
            selectedCategories: [],

            choosableProperties: [],
            measurableProperties: [],
        };
        this.getProduct = this.getProduct.bind(this);
        this.getProductCustomProperties = this.getProductCustomProperties.bind(this);

        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);

        this.showCategoriesSelectionWindow = this.showCategoriesSelectionWindow.bind(this);
        this.closeCategoriesSelectionWindow = this.closeCategoriesSelectionWindow.bind(this);
        this.saveSelectedCategories = this.saveSelectedCategories.bind(this);
        this.finishedSelectingCategories = this.finishedSelectingCategories.bind(this);
    }

    componentDidMount() {
        //#region get product
        if (this.props.match.params.productId != "new") {
            this.getProduct();
            this.getProductCustomProperties();
        }
        else {
            this.setState({
                product: {
                    ...this.state.product,
                    id: "new",
                }
            })
        }


        //#endregion get product
        //#region get users
        let url = Constants.baseUrl + "/API/UserPanel/GetUsers"
        fetch(url, {
            method: "GET",

        })
            .then(response => response.json())
            .then(data => {
                if(data.success)
                this.setState({
                    users: data.users,
                    usersReactSelectItems: data.users.map((item: IUser) => {
                        let fullName = item.firstName + " " + item.lastName;
                        let label;
                        if (fullName.length > 1 && item.lastName != null && item.firstName != null)
                            label = item.userName + " | " + item.firstName + " " + item.lastName;
                        else
                            label = item.userName;

                        return { value: item.id, label: label }
                    }),
                })
                else
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            formError: data.formError,
                        },

                    })
            })

        //#endregion get users
        //#region get Author id
        url = Constants.baseUrl + "/API/Auth/AuthStatus";
        fetch(url, {
            method:"GET"
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    product: {
                        ...this.state.product,
                        authorId: data.user.id,
                    }
                })
            })
        //#endregion
        //#region getCategoryData

        url = Constants.baseUrl + "/API/UserPanel/GetProductCategories"
        let dataToSend = { productId: this.props.match.params.productId }
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        categoryTree: data.categoryTree,
                        selectedCategories: data.productCategoriesId,
                    })
                }
                else {
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            formError: data.error,
                        }
                    })
                }
            })
        //#endregion getCategoryData
    }
    getProduct() {
            let url = Constants.baseUrl + "/API/UserPanel/GetProduct";
            let dataToSend = { productId: this.props.match.params.productId }
            fetch(url, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
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
    getProductCustomProperties() {
        let url = Constants.baseUrl + "/API/UserPanel/GetProductCustomProperties"
        let dataToSend = { productId: this.props.match.params.productId }
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        measurableProperties: data.measurableProperties,
                        choosableProperties: data.choosableProperties,
                    })
                }
                else
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            formError: data.formError,
                        }
                    })
            })

    }

    onInfoinputChange(inputName: string, value: string | number | boolean | string[] | undefined | null) {
        if (inputName == "selectedCategories")
            this.setState({
                selectedCategories: value as string[],
            });
        else
            this.setState({
                product: {
                    ...this.state.product,
                    [inputName]: value,
                },
            });
    }

    showCategoriesSelectionWindow(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            categoriesWindowVisible: true,
        });
    }
    closeCategoriesSelectionWindow(e: React.MouseEvent<HTMLElement>) {
        this.setState({
            categoriesWindowVisible: false,
        })
    }

    finishedSelectingCategories(selCat: string[]) {
        this.setState({
            categoriesWindowVisible: false,
        });
        this.saveSelectedCategories(selCat);
        this.getProductCustomProperties();

    }
    saveSelectedCategories(selCat: string[]) {
        let url = Constants.baseUrl + "/API/UserPanel/SaveProductCategories";
        let dataToSend = {
            productId: this.state.product.id,
            selectedCategories: selCat,
        }
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    ajaxResponse: {
                        ...this.state.ajaxResponse,
                        formError: data.error,
                        success: data.success,
                    }
                })
            })
    }

    saveProduct() {
        // #region data checks
        let ok = true;
        let nameError = "";
        let formError = "";
        if (this.state.product.name == undefined || this.state.product.name == null || this.state.product.name == "") {
            ok = false;
            nameError += "Name cannot be empty.";
        }
        if (this.state.product.ownerId == undefined || this.state.product.ownerId == null || this.state.product.ownerId == "") {
            ok = false;
            formError += "The product has to have an Owner.";
        }
        if (!ok)
            this.setState({
                ajaxResponse: {
                    ...this.state.ajaxResponse,
                    formError: formError,
                    nameError: nameError,
                }
            });
        // #endregion data checks
        if (ok) {
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
    }
    deleteProduct() {
        let confirmed: boolean = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
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
    }

    render() {
        var redirectElement;
        // #region redirectElement
        if (this.state.redirect.length > 0)
            redirectElement = <Redirect to={{
                pathname: this.state.redirect,
                state: { returnUrl: "./../" }
            }} />
        else
            redirectElement = "";
        //#endregion redirectElement

        var categoriesSelectionWindow;
        // #region categoriesSelectionWindow
        if (this.state.categoriesWindowVisible) {
             const content = <ProductCategorySelectionPanel
                categoryTree={this.state.categoryTree}
                selectedCategories={this.state.selectedCategories}
                onChange={this.onInfoinputChange}
                onFinishedSelecting={this.finishedSelectingCategories}
                onSaveClick={this.saveSelectedCategories}
                inputName="selectedCategories"
            />

            categoriesSelectionWindow = (
                <PopupWindow
                    onCloseClick={this.closeCategoriesSelectionWindow}
                    title="Choose Product's Categories"
                    content={content}
                />
            )
            
        }
        else
            categoriesSelectionWindow = '';
        //#endregion categoriesSelectionWindow
        return (
            <div className={`ProductPanel-${this.state.product.id}`} >
                {redirectElement}
                {categoriesSelectionWindow}
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
                            {this.state.ajaxResponse.nameError}
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
                        <ReactSelect
                            value={this.state.usersReactSelectItems.filter((item) => { return item.value == this.state.product.ownerId })}
                            onChange={(selectedItem) => { this.onInfoinputChange("ownerId", selectedItem?.value) }}
                            options={this.state.usersReactSelectItems}
                        />
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
                    <div className="Properties">
                        <h3>Choosable Properties</h3>
                        <hr />
                        {
                            //[1, 2, 3].map(item => { console.log(this.state.choosableProperties); return <div className="test"></div> })
                        }
                        {
                            this.state.choosableProperties.map((choosablePropItem) => {
                                const options = choosablePropItem.itemsToChoose.map((itemToChooseItem) => {
                                    return { value: itemToChooseItem, label: itemToChooseItem };
                                });
                                console.log("choosable foreach");
                                return (
                                    <div className="inputGroup">
                                        <span>{choosablePropItem.propertyName}</span>
                                        <ReactSelect
                                            options={options}
                                            onChange={
                                                (selectedItem) => {
                                                    this.onInfoinputChange("choosablePropertiesValues[" + choosablePropItem.id + "]", selectedItem?.value)
                                                }
                                            }
                                            value={
                                                options.filter((optionItem) => {
                                                    return optionItem.value == this.state.product.choosablePropertiesValue[choosablePropItem.id]
                                                })[0]
                                            }
                                        />
                                    </div>
                                )
                            })
                        }

                        <h3>Measurable Properties</h3>
                        <hr />
                        {
                            this.state.measurableProperties.map((measurablePropItem) => {

                                return (
                                    <div className="inputGroup">
                                        <span>{measurablePropItem.propertyName}</span>
                                        <NumberInfoInput
                                            value={this.state.product.measurablePropertiesValue[measurablePropItem.id]}
                                            inputName={"measurablePropertiesValue[" + measurablePropItem.id + "]"}
                                            onChange={this.onInfoinputChange}
                                            editingEnabled={this.state.editingEnabled}
                                        />
                                    </div>
                                    )
                            })
                        }



                    </div>
                </div>
                <div className="formError">
                    {this.state.ajaxResponse.formError}
                </div>
                <div className="buttonGroup">
                    <button className="" onClick={this.showCategoriesSelectionWindow} >Change Categories</button>
                    <button className="" onClick={this.saveProduct}>Save</button>
                    <button className="" onClick={this.deleteProduct} >Delete this Product</button>
                </div>
            </div>


        );
    }
}