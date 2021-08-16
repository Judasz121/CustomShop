﻿import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import { TextInfoInput, CheckBoxInfoInput } from '../../components/globalInputComponents';
import style from "../../styles/adminPanel.module.css";
import { IMeasurableProperty, IChoosableProperty, ICategoryProductProperty } from "../../types/categoryPropertyTypes";
import { RouteComponentProps, useParams } from 'react-router-dom';
import globalStyle from "../../styles/global.module.css";

interface CategoryPropertiesManagmentPanelProps extends RouteComponentProps<{ categoryId: string }> {

}
type CategoryPropertiesManagmentPanelState = {
    ajaxResponse: CategoryProductPropertiesFetchResponse,
    newMeasurablePropertyId: number,
    newChoosablePropertyId: number,
    editedProperties: {
        measurableProperties: IMeasurableProperty[],
        choosableProperties: IChoosableProperty[],
    }
}

type CategoryProductPropertiesFetchResponse = {
    choosableProperties: IChoosableProperty[],
    measurableProperties: IMeasurableProperty[],
    formError: string,
    success: boolean,
    nameError: string,
}

type newItemAddedFunction = (newItemNewId: string, newItemOldId: string) => void;

export default class CategoryPropertiesManagmentPanel extends React.Component<CategoryPropertiesManagmentPanelProps, CategoryPropertiesManagmentPanelState> {
    constructor(props: CategoryPropertiesManagmentPanelProps) {
        super(props);

        this.state = {
            ajaxResponse: {
                success: false,
                formError: "",
                nameError:"",
                measurableProperties: [],
                choosableProperties: [],
            },
            newMeasurablePropertyId: 1,
            newChoosablePropertyId: 1,
            editedProperties: {
                measurableProperties: [],
                choosableProperties: [],
            }
        }
        this.choosablePropertyEdited = this.choosablePropertyEdited.bind(this);
        this.measurablePropertyEdited = this.measurablePropertyEdited.bind(this);
        this.newChoosablePropertyAdded = this.newChoosablePropertyAdded.bind(this);
        this.newMeasurablePropertyAdded = this.newMeasurablePropertyAdded.bind(this);
        this.addNewChoosableProperty = this.addNewChoosableProperty.bind(this);
        this.addNewMeasurableProperty = this.addNewMeasurableProperty.bind(this);
    }

    componentDidMount() {
        let dataUrl = Constants.baseUrl + "/API/AdminPanel/GetCategoryProperties";
        let dataToSend = { categoryId: this.props.match.params.categoryId };
        fetch(dataUrl, {
            method: "POST",
            body: JSON.stringify(dataToSend),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data: CategoryProductPropertiesFetchResponse) => {
                this.setState({
                    ajaxResponse: data,
                    editedProperties: {
                        choosableProperties: data.choosableProperties,
                        measurableProperties: data.measurableProperties,
                    }
                })
            })
    }

    measurablePropertyEdited(target: IMeasurableProperty) {
        var newProps = this.state.editedProperties.measurableProperties.map((item, index) => {
            if (item.id == target.id)
                return target;
            else
                return item;
        });
        this.setState({
            editedProperties: {
                ...this.state.editedProperties,
                measurableProperties: newProps,
            }
        });

    }
    choosablePropertyEdited(target: IChoosableProperty) {
        var newProps = this.state.editedProperties.choosableProperties.map((item, index) => {
            if (item.id == target.id)
                return target;
            else
                return item;
        });
        this.setState({
            editedProperties: {
                ...this.state.editedProperties,
                choosableProperties: newProps,
            }
        });

    }

    addNewChoosableProperty() {
        console.log("add new choosable called");
        var newProp: IChoosableProperty = {
            id: "new" + this.state.newMeasurablePropertyId,
            categoryId: this.props.match.params.categoryId,
            propertyName: "new choosable property",
            propertyNameAbbreviation: "",
            itemsToChoose: [],
        }
        this.setState({
            editedProperties: {
                choosableProperties: [
                    ...this.state.editedProperties.choosableProperties,
                    newProp,
                ],
                measurableProperties: this.state.editedProperties.measurableProperties,
            },
            newChoosablePropertyId: this.state.newChoosablePropertyId + 1,
        });
        console.log("add new choosable end");
    }

    addNewMeasurableProperty() {        
        var newProp: IMeasurableProperty = {
            id: "new" + this.state.newMeasurablePropertyId,
            categoryId: this.props.match.params.categoryId,
            propertyName: "new measurable property",
            propertyNameAbbreviation: "",
            isMetric: false,
            toMetricModifier: 0,
            unitFullName: "",
            unitName: "",
        }
        this.setState({
            editedProperties: {
                measurableProperties: [
                    ...this.state.editedProperties.measurableProperties,
                    newProp,
                ],
                choosableProperties: this.state.editedProperties.choosableProperties,
            },
            newMeasurablePropertyId: this.state.newMeasurablePropertyId + 1,
        })
    }

    newMeasurablePropertyAdded(newPropNewId: string, newPropOldId: string) {
        this.setState({
            editedProperties: {
                choosableProperties: this.state.editedProperties.choosableProperties,
                measurableProperties:
                    this.state.editedProperties.measurableProperties.map((item: IMeasurableProperty, index: number) => {
                        if (item.id == newPropOldId)
                            item.id = newPropNewId;
                        return item;
                    }),
            }
        });
    }
    newChoosablePropertyAdded(newPropNewId: string, newPropOldId: string) {
        this.setState({
            editedProperties: {
                measurableProperties: this.state.editedProperties.measurableProperties,
                choosableProperties:
                    this.state.editedProperties.choosableProperties.map((item: IChoosableProperty, index: number) => {
                        if (item.id == newPropOldId)
                            item.id = newPropNewId;
                        return item;
                    }),
            }
        });
    }

    render() {
        return (
            <div id="CategoryEditPanel" >
                <div className="CategoryPropertiesManagmentPanelList">
                    categoryId: {this.props.match.params.categoryId}
                    <div className={style.buttonGroup}>
                        <h1>Add new</h1>
                        <button className={globalStyle.button} onClick={this.addNewChoosableProperty}>Choosable Property</button>
                        <button className={globalStyle.button} onClick={this.addNewMeasurableProperty}>Measurable Property</button>
                    </div>
                    <div className="choosableProperties" >
                        <h2>Choosable Properties</h2>
                        {
                            this.state.editedProperties.choosableProperties.map((item: IChoosableProperty, index: number) => {
                                return <ChoosablePropertyInfoEditPanel
                                    key={item.id}
                                    choosableProperty={item}
                                    onChange={this.choosablePropertyEdited}
                                    onNewPropertySaved={this.newChoosablePropertyAdded}
                                />
                            })
                        }
                    </div>
                    <div className="measurableProperties">
                        <h2>MeasurableProperty</h2>
                        {
                            this.state.editedProperties.measurableProperties.map((item: IMeasurableProperty, index: number) => {
                                return <MeasurablePropertyInfoEditPanel
                                    key={item.id}
                                    measurableProperty={item}
                                    onChange={this.measurablePropertyEdited}
                                    onNewPropertySaved={this.newChoosablePropertyAdded}
                                />
                            })
                        }

                    </div>
                </div>
            </div>
        )
    }
}

//#region measurableProperty
type MeasurablePropertyInfoEditPanelProps = {
    measurableProperty: IMeasurableProperty,
    onChange: Function,
    onNewPropertySaved: newItemAddedFunction,
}
type MeasurablePropertyInfoEditPanelState = {
    editingEnabled: boolean,
    measurableProperty: IMeasurableProperty,
    saveResponse: SavePropertyResponse,
    
}

type SavePropertyResponse = {
    newId: string,
    success: boolean,
    formError: string,
    nameError: string,
}

export class MeasurablePropertyInfoEditPanel extends React.Component<MeasurablePropertyInfoEditPanelProps, MeasurablePropertyInfoEditPanelState>  {
    constructor(props: MeasurablePropertyInfoEditPanelProps) {
        super(props);

        this.state = {
            editingEnabled: false,
            measurableProperty: this.props.measurableProperty,
            saveResponse: {
                formError: "",
                success: false,
                nameError: "",
                newId: "",
            },
        }
        if (this.props.measurableProperty.id.includes("new"))
            this.state = {
                ...this.state,
                editingEnabled: true,
            }

        this.enableEditing = this.enableEditing.bind(this);
        this.disableEditing = this.disableEditing.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.onInfoinputChange = this.onInfoinputChange.bind(this);
    }
    enableEditing() {
        this.setState({
            editingEnabled: true,
        })
    }
    disableEditing() {
        this.setState({
            editingEnabled: false,
        })
    }

    saveProperty() {
        let url = Constants.baseUrl + "/API/AdminPanel/SaveCategoryProductMeasurableProperty";
        let dataToSend = { measurableProperty: this.state.measurableProperty };
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then((data: SavePropertyResponse) => {
                if (data.success && data.newId != null && data.newId.length > 0) {
                    this.props.onNewPropertySaved(data.newId, this.props.measurableProperty.id);
                    this.setState({
                        measurableProperty    : {
                            ...this.state.measurableProperty,
                            id: data.newId,
                        },
                        saveResponse: data,
                    });
                    this.disableEditing();
                    setTimeout(() => {
                        this.setState({
                            saveResponse: {
                                ...this.state.saveResponse,
                                formError: "",
                                nameError: "",
                            }
                        });
                    }, 8000)
                }
                else {
                    this.setState({
                        saveResponse: data,
                    })
                }
            });
    }

    onInfoinputChange(inputName: string, value: string | boolean | number) {
        let newProp: IMeasurableProperty = {
            ...this.state.measurableProperty,
            [inputName]: value,
        }
        this.setState({
            measurableProperty: newProp
        })

        this.props.onChange(newProp);
    }

    render() {
        return (
            <div className={`MeasurablePropertyPanel-${this.props.measurableProperty.id}`} >
                <div className="header">
                    <h1>
                        <TextInfoInput
                            inputName="propertyName"
                            value={this.props.measurableProperty.propertyName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="name of the property"
                        />
                        <span className="error">
                            {this.state.saveResponse.formError}
                        </span>
                    </h1>
                </div>
                <div className="content">
                    <div className="inputGroup">
                        <span>Property Name Abbrevietion</span>
                        <TextInfoInput
                            inputName="propertyNameAbbreviation"
                            value={this.props.measurableProperty.propertyNameAbbreviation}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="Property Name Abbreviation"
                        />
                        <span className="error">
                            { }
                        </span>
                    </div>
                    <div className="inputGroup">
                        <span>Unit Name</span>
                        <TextInfoInput
                            inputName="unitName"
                            value={this.props.measurableProperty.unitName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="unit name"
                        />
                        <span className="error">
                            { }
                        </span>
                    </div>
                    <div className="inputGroup">
                        <span>Unit Full Name</span>
                        <TextInfoInput
                            inputName="unitFullName"
                            value={this.props.measurableProperty.unitFullName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="unit full name"
                        />
                    </div>
                    <div className="inputGroup">
                        <CheckBoxInfoInput
                            inputName="isMetric"
                            value={this.props.measurableProperty.isMetric}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            label="Is Unit Metric?"
                        />
                    </div>
                    <div className="inputGroup">
                        
                    </div>
                </div>
                <div className="formError">
                    {this.state.saveResponse.formError}
                </div>
                <button className="" onClick={this.enableEditing}>Edit</button>
                <button className="" onClick={this.saveProperty}>Save</button>
            </div>
        )
    }
}
// #endregion measurableProperty

//#region choosableProperty
type ChoosablePropertyInfoEditPanelProps = {
    choosableProperty: IChoosableProperty,
    onChange: Function,
    onNewPropertySaved: newItemAddedFunction,
}
type ChoosablePropertyInfoEditPanelState = {
    editingEnabled: boolean,
    choosableProperty: IChoosableProperty,
    saveResponse: SavePropertyResponse,
}

class ChoosablePropertyInfoEditPanel extends React.Component <ChoosablePropertyInfoEditPanelProps, ChoosablePropertyInfoEditPanelState> {
    constructor(props: ChoosablePropertyInfoEditPanelProps) {
        super(props);
        this.state = {
            editingEnabled: false,
            choosableProperty: this.props.choosableProperty,
            saveResponse: {
                success: false,
                formError: "",
                nameError: "",
                newId: "",
            }
        }

        if (this.props.choosableProperty.id.includes("new"))
            this.state = {
                ...this.state,
                editingEnabled: true,
            }


        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.enableEditing = this.enableEditing.bind(this);
        this.disableEditing = this.disableEditing.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
    }
    onInfoinputChange(inputName: string, value: string | number | boolean) {
        let newProp: IChoosableProperty = {
            ...this.state.choosableProperty,
            [inputName]: value,
        }
        this.setState({
            choosableProperty: newProp,
        });
        this.props.onChange(newProp);
    }
    saveProperty() {
        let url = Constants.baseUrl + "/API/AdminPanel/SaveCategoryProductChoosableProperty";
        let dataToSend = {
            choosableProperty: this.state.choosableProperty,
        }
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then((data: SavePropertyResponse) => {
                if (data.success && data.newId != null && data.newId.length > 0) {
                    this.props.onNewPropertySaved(data.newId, this.props.choosableProperty.id);
                    this.setState({
                        choosableProperty: {
                            ...this.state.choosableProperty,
                            id: data.newId,
                        },
                        saveResponse: data,
                    });
                    this.disableEditing();
                    setTimeout(() => {
                        this.setState({
                            saveResponse: {
                                ...this.state.saveResponse,
                                formError: "",
                                nameError: "",
                            }
                        });
                    }, 8000)
                }
                else {
                    this.setState({
                        saveResponse: data,
                    })
                }
            })
    }
    enableEditing() {
        this.setState({
            editingEnabled: true,
        })
    }
    disableEditing() {
        this.setState({
            editingEnabled: false,
        })
    }
    cancelEditing() {
        this.setState({
            editingEnabled: false,
            choosableProperty: this.props.choosableProperty,
        })
    }
    render() {
        return (
            <div className={`ChoosablePropertyPanel-${this.props.choosableProperty.id}`} >
                <div className="header">
                    <h1>
                        <TextInfoInput
                            inputName="propertyName"
                            value={this.props.choosableProperty.propertyName}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="property name"
                        />
                        <span className="error">
                            {this.state.saveResponse.formError}
                        </span>
                    </h1>
                </div>
                <div className="content">
                    <div className="inputGroup">
                        <span>Property Name Abbrevietion</span>
                        <TextInfoInput
                            inputName="propertyNameAbbreviation"
                            value={this.props.choosableProperty.propertyNameAbbreviation}
                            editingEnabled={this.state.editingEnabled}
                            onChange={this.onInfoinputChange}
                            placeholderValue="Property name abbreviation"
                        />
                        <span className="error">
                            { }
                        </span>
                    </div>
                    <div className="inputGroup">
                        <span>Items to choose</span>

                    </div>
                </div>
                <div className="formError">
                    {this.state.saveResponse.formError}
                </div>
                <button className="" onClick={this.enableEditing}>Edit</button>
                <button className="" onClick={this.saveProperty}>Save</button>
            </div>
            
            
       );
    }
}

//#endregion choosableProperty