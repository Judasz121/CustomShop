import React from 'react';
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
import { PopupWindow } from '../../../components/PopupWindow';
import { CategoriesIheritedSelectionPanel } from './../../../components/categoryComponents/CategoriesInheritedSelectionPanel';
import { ICategory } from '../../../types/categoryTypes';
import { IChoosableProperty, IMeasurableProperty } from '../../../types/categoryPropertyTypes';
import { TextAreaInfoInput, TextInfoInput } from '../../../components/inputComponents/Text';
import { NumberInfoInput } from '../../../components/inputComponents/Numeric';
import { ImageInfoInput, ImagesInput } from '../../../components/inputComponents/Image';
import { IError } from '../../../types/errorTypes';

interface ProductEditPanelProps extends RouteComponentProps<{ productId: string }, StaticContext, { selectedCategories: string[] } >{

}
type ProductEditPanelState = {
    product: IProduct,
    newProductImages: {
        newThumbnailImage: File | null,
        newImages: File[],
        imagesToDelete: string[],
    }
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
    errors: IError[],
    newId: string,
}

type ReactSelectItem = { label: string, value: string, }

export default class ProductEditPanel extends React.Component<ProductEditPanelProps, ProductEditPanelState> {
    constructor(props: ProductEditPanelProps) {
        super(props);

        let showCategoriesWindow: boolean = false;
        if (this.props.match.params.productId == "new")
            showCategoriesWindow = true;

        this.state = {
            ajaxResponse: {
                success: false,
                errors: [],
                newId: "",
            },
            
            product: {
                id: this.props.match.params.productId,
            } as IProduct,
            newProductImages: {
                newThumbnailImage: null,
                newImages: [],
                imagesToDelete: [],
            },
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
        this.getNewProductCustomProperties = this.getNewProductCustomProperties.bind(this);

        this.onInfoinputChange = this.onInfoinputChange.bind(this);

        this.onSaveSelectedCategoriesClick = this.onSaveSelectedCategoriesClick.bind(this);
        this.onFinishedSelectingCategories = this.onFinishedSelectingCategories.bind(this);
        this.saveSelectedCategories = this.saveSelectedCategories.bind(this);
        this.showCategoriesSelectionWindow = this.showCategoriesSelectionWindow.bind(this);
        this.closeCategoriesSelectionWindow = this.closeCategoriesSelectionWindow.bind(this);

        this.onSaveProductClick = this.onSaveProductClick.bind(this);
        this.saveProductImages = this.saveProductImages.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
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
                            errors: data.errors,
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
        let dataToSend = { productId: this.state.product.id }
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
                    if (this.state.product.id == "new") {
                        this.setState({
                            categoryTree: data.categoryTree,
                            selectedCategories: data.productCategoriesId,
                            categoriesWindowVisible: false,
                        })
                        this.setState({
                            categoriesWindowVisible: true,
                        })
                    }
                    this.setState({
                        categoryTree: data.categoryTree,
                        selectedCategories: data.productCategoriesId,
                    });
                }
                else {
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            errors: data.errors,
                        }
                    });
                }
            })
        //#endregion getCategoryData
    }
    getProduct() {
            let url = Constants.baseUrl + "/API/UserPanel/GetProduct";
            let dataToSend = { productId: this.state.product.id }
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
        let dataToSend = { productId: this.state.product.id }
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
                            errors: data.errors,
                        }
                    })
            })
    }
    getNewProductCustomProperties(selectedCategories: string[]) {
        let url = Constants.baseUrl + "/API/UserPanel/GetNewProductCustomProperties"
        let dataToSend = {
            selectedCategories: selectedCategories,
        }
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
                            errors: data.errors,
                        }
                    })
            })
    }

    onInfoinputChange(inputName: string, value: string | number | boolean | string[] | undefined | null) {
        if (inputName == "selectedCategories")
            this.setState({
                selectedCategories: value as string[],
            }, () => { })
        else if (inputName.split(".")[0] == "choosablePropertiesValue") {
            this.setState({
                product: {
                    ...this.state.product,
                    choosablePropertiesValue: {
                        ...this.state.product.choosablePropertiesValue,
                        [inputName.split(".")[1]]: value as string,
                    }
                }
            })
        }
        else if (inputName.split(".")[0] == "measurablePropertiesValue") {
            this.setState({
                product: {
                    ...this.state.product,
                    measurablePropertiesValue: {
                        ...this.state.product.measurablePropertiesValue,
                        [inputName.split(".")[1]]: value as number,
                    }
                }
            })
        }
        else if (inputName.toUpperCase().includes("IMAGE"))
        {
            this.setState({
                newProductImages: {
                    ...this.state.newProductImages,
                    [inputName]: value,
                }
            });
        }
        else
            this.setState({
                product: {
                    ...this.state.product,
                    [inputName]: value,
                },
            });
    }

    onSaveSelectedCategoriesClick(selCat: string[]) {
        if (this.state.product.id == "new")
            this.getNewProductCustomProperties(selCat);
        else {
            this.saveSelectedCategories(selCat);
        }
    }
    onFinishedSelectingCategories(selCat: string[]) {
        this.setState({
            categoriesWindowVisible: false,
        });
        if (this.state.product.id == "new")
            this.getNewProductCustomProperties(selCat);
        else {
            this.saveSelectedCategories(selCat);
        }
    }
    saveSelectedCategories(selCat?: string[]) {
        if (selCat == undefined || selCat == null)
            selCat = this.state.selectedCategories;

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
                        errors: data.errors,
                        success: data.success,
                    }
                });
                this.getProductCustomProperties();
            })
    }
    showCategoriesSelectionWindow(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            categoriesWindowVisible: true,
        });
    }
    closeCategoriesSelectionWindow(e: React.MouseEvent<HTMLElement>) {
        this.setState({
            categoriesWindowVisible: false,
        });
        this.getProductCustomProperties();
    }

    onSaveProductClick() {
        if (this.state.product.id == "new")
            this.addNewProduct();
        else
            this.saveProduct();
    }
    saveProductImages() {
        var dataToSend: FormData = new FormData();
        dataToSend.append("productId", this.state.product.id);
        var url: string = Constants.baseUrl + "/API/UserPanel/SaveProductImages";
        let send: boolean = false;
        var i = 0;
        if (this.state.newProductImages.newImages) {
            this.state.newProductImages.newImages.forEach(imageFileItem => {
                dataToSend.append("newImages[" + i + "]", imageFileItem, imageFileItem.name);
            });
            send = true;
        }

        i = 0;
        if (this.state.newProductImages.imagesToDelete) {
            this.state.newProductImages.imagesToDelete.forEach(imageToDeleteItem => {
                dataToSend.append("imagesToDelete[" + i + "]", imageToDeleteItem);
            });
            send = true;
        }

        if (this.state.newProductImages.newThumbnailImage != null) {
            dataToSend.append("newThumbnailImage", this.state.newProductImages.newThumbnailImage!, this.state.newProductImages.newThumbnailImage!.name);
            send = true;
        }

        if (send)
            fetch(url, {
                method: "POST",
                body: dataToSend,
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        ajaxResponse: {
                            ...this.state.ajaxResponse,
                            errors: this.state.ajaxResponse.errors.concat(data.errors),
                        }
                    })
                })

    }
    saveProduct() {
        // #region data checks
        let ok = true;
        let errors: IError[] = [];
        if (this.state.product.name == undefined || this.state.product.name == null || this.state.product.name == "") {
            ok = false;
            errors.push({
                fieldName: "name",
                message: "Name cannot be empty.",
            });
        }
        if (this.state.product.ownerId == undefined || this.state.product.ownerId == null || this.state.product.ownerId == "") {
            ok = false;
            errors.push({
                fieldName: "name",
                message: "The product has to have an Owner."
            })
        }
        if (!ok)
            this.setState({
                ajaxResponse: {
                    ...this.state.ajaxResponse,
                    errors: errors,
                }
            });
        // #endregion data checks
        if (ok) {
            var url = Constants.baseUrl + "/API/UserPanel/SaveProduct";
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
                        this.saveProductImages();

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
                                        errors: [],
                                    }
                                });
                            }, 8000)
                        });

                    }
                    else if (data.success) {
                        this.saveProductImages();

                        this.setState({
                            ajaxResponse: data,
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    ajaxResponse: {
                                        ...this.state.ajaxResponse,
                                        errors: [],
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
    addNewProduct() {
        // #region data checks
        var ok = true;
        var errors: IError[] = [];
        if (this.state.product.name == undefined || this.state.product.name == null || this.state.product.name == "") {
            ok = false;
            errors.push({
                fieldName: "name",
                message: "Name cannot be empty."
            });
        }
        if (this.state.product.ownerId == undefined || this.state.product.ownerId == null || this.state.product.ownerId == "") {
            ok = false;
            errors.push({
                fieldName: "owner",
                message: "The prodct has to have an Owner."
            });
        }
        if (this.state.product.price == undefined || this.state.product.price == null) {
            ok = false;
            errors.push({
                fieldName: "price",
                message: "Price cannot be empty."
            })
        }
        if (!ok)
            this.setState({
                ajaxResponse: {
                    ...this.state.ajaxResponse,
                    errors: errors
                }
            });
        // #endregion data checks
        if (ok) {
            var url = Constants.baseUrl + "/API/UserPanel/AddProduct";
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
                        this.saveProductImages();
                        this.setState({
                            product: {
                                ...this.state.product,
                                id: data.newId,
                            },
                            ajaxResponse: data,
                        }, () => {
                            this.saveSelectedCategories();
                            setTimeout(() => {
                                this.setState({
                                    ajaxResponse: {
                                        ...this.state.ajaxResponse,
                                        errors: [],
                                    }
                                });
                            }, 8000)
                        });

                    }
                    else if (data.success) {
                        this.saveProductImages();

                        this.setState({
                            ajaxResponse: data,
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    ajaxResponse: {
                                        ...this.state.ajaxResponse,
                                        errors: [],
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
                productId: this.state.product.id,
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
            const content = <CategoriesIheritedSelectionPanel
                categoryTree={this.state.categoryTree}
                selectedCategories={this.state.selectedCategories}
                onChange={this.onInfoinputChange}
                onFinishedSelecting={this.onFinishedSelectingCategories}
                onSaveClick={this.onSaveSelectedCategoriesClick}
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
        //#region errors
        var priceErrors = "", nameErrors = "", formErrors = "";

        this.state.ajaxResponse.errors.forEach((errorItem) => {
            if (errorItem.fieldName == "price")
                priceErrors += errorItem.message + "\n";
            else if (errorItem.fieldName == "name")
                nameErrors += errorItem.message + "\n";
            else
                formErrors += errorItem.message + "\n";
        })
   
        //#endregion errors
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
                            {nameErrors}
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
                            image={this.state.newProductImages.newThumbnailImage}
                            imagePath={this.state.product.thumbnailImagePath}
                            editingEnabled={this.state.editingEnabled}
                        />
                    </div>
                    <div className="inputGroup" >
                        <span>Images</span>
                        <ImagesInput
                            value={this.state.newProductImages.newImages}
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
                    <div className="inputGroup">
                        <span>Price</span>
                        <NumberInfoInput
                            value={this.state.product.price}
                            onChange={this.onInfoinputChange}
                            editingEnabled={this.state.editingEnabled}
                            inputName="price"
                        />
                        <div className="error">
                            {priceErrors}
                        </div>
                    </div>
                    <div className="Properties">
                        <h3>Choosable Properties</h3>
                        <hr />
                        {
                            this.state.choosableProperties.map((choosablePropItem) => {
                                const options = choosablePropItem.itemsToChoose.map((itemToChooseItem) => {
                                    return { value: itemToChooseItem, label: itemToChooseItem };
                                });
                                var value = null;
                                if (this.state.product.choosablePropertiesValue)
                                    value = options.filter((optionItem) => {
                                        return optionItem.value == this.state.product.choosablePropertiesValue[choosablePropItem.id]
                                    })[0];
                            
                                return (
                                    <div className="inputGroup">
                                        <span>{choosablePropItem.propertyName}</span>
                                        <ReactSelect
                                            options={options}
                                            onChange={
                                                (selectedItem) => {
                                                    this.onInfoinputChange("choosablePropertiesValue." + choosablePropItem.id, selectedItem?.value)
                                                }
                                            }
                                            value={value}
                                                
                                        />
                                    </div>
                                )
                            })
                        }

                        <h3>Measurable Properties</h3>
                        <hr />
                        {
                            this.state.measurableProperties.map((measurablePropItem) => {
                                var value = null;
                                if (this.state.product.measurablePropertiesValue )
                                    value = this.state.product.measurablePropertiesValue[measurablePropItem.id];
                                return (
                                    <div className="inputGroup">
                                        <span>{measurablePropItem.propertyName}</span>
                                        <NumberInfoInput
                                            value={value}
                                            inputName={"measurablePropertiesValue." + measurablePropItem.id}
                                            onChange={this.onInfoinputChange}
                                            editingEnabled={this.state.editingEnabled}
                                        />
                                    </div>
                                    )
                            })
                        }



                    </div>
                </div>
                <div className="errors">
                    {formErrors}
                </div>
                <div className="buttonGroup">
                    <button className="" onClick={this.showCategoriesSelectionWindow} >Change Categories</button>
                    <button className="" onClick={this.onSaveProductClick}>Save</button>
                    <button className="" onClick={this.deleteProduct} >Delete this Product</button>
                </div>
            </div>


        );
    }
}