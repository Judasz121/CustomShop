import React from 'react';
import 'react-sortable-tree/style.css';
import Constants from '../../router/constants';
import { TextInfoInput, CheckBoxInfoInput } from '../../components/globalInputComponents';
import style from "../../styles/adminPanel.module.css";
import { IMeasurableProperty, IChoosableProperty } from "../../types/categoryPropertyTypes";

type CategoryPropertiesEditPanelProps = {

}
type CategoryPropertiesEditPanelState = {
    measurableProperties: IMeasurableProperty[],
    choosableProperties: IChoosableProperty[],
}



export class CategoryPropertiesEditPanel extends React.Component<CategoryPropertiesEditPanelProps, CategoryPropertiesEditPanelState> {
    constructor(props: CategoryPropertiesEditPanelProps) {
        super(props);

        this.state = {
            measurableProperties: [],
            choosableProperties: [],
        }
    }

    componentDidMount() {

        let dataUrl = Constants.baseUrl + "/API/AdminPanel/GetCategoryProperties";
        fetch(dataUrl, {
            method: "GET",

        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    
                });

            })
    }

    propertyEdited(target: object, isMeasurableProperty: boolean) {

        //this.setState((state) => {
        //    var newUsers = state.users.map((item) => {
        //        if (item.id == target.id)
        //            return target;
        //        else
        //            return item;
        //    });
        //    return {
        //        users: newUsers,
        //    }
        //});
    }

    addNewProperty() {

    }

    newPropertyAdded(newPropNewId: string, newPropOldId: string) {

    }
    render() {
        return (
            <div id="CategoryEditPanel" >
                <div className="CategoryPropertiesEditPanelList">
                    <div className="addCategoryPropertyContainer">
                        <button className="" onClick={this.addNewProperty}>New Property</button>
                    </div>
                    {
                        //this.state.properties.map((item, index) => {
                        //    return <MeasurablePropertyInfoEditPanel />
                        //})
                    }
                </div>
            </div>
        )
    }
}
type MeasurablePropertyInfoEditPanelProps = {
    editingEnabled: boolean,
    measurableProperty: {
        id: string,
        propertyName: string,
        propertyNameAbbreviation: string,
        unitName: string,
        unitFullName: string,
        isMetric: boolean,
        toMetricModifier: number,
    },
}
type MeasurablePropertyInfoEditPanelState = {
    editingEnabled: boolean,
    measurableProperty: {
        id: string,
        propertyName: string,
        propertyNameAbbreviation: string,
        unitName: string,
        unitFullName: string,
        isMetric: boolean,
        toMetricModifier: number,
    },
    saveResponse: {
        formError: string,
        success: boolean,
    }
}

export class MeasurablePropertyInfoEditPanel extends React.Component<MeasurablePropertyInfoEditPanelProps, MeasurablePropertyInfoEditPanelState>  {
    constructor(props: MeasurablePropertyInfoEditPanelProps) {
        super(props);

        this.state = {
            editingEnabled: this.props.editingEnabled,
            saveResponse: {
                formError: "",
                success: false,
            },
            measurableProperty: {
                id: this.state.measurableProperty.id,
                propertyName: this.props.measurableProperty.propertyName,
                propertyNameAbbreviation: this.props.measurableProperty.propertyNameAbbreviation,
                unitName: this.props.measurableProperty.unitName,
                unitFullName: this.props.measurableProperty.unitFullName,
                isMetric: this.props.measurableProperty.isMetric,
                toMetricModifier: this.props.measurableProperty.toMetricModifier,
            }
        }

        this.enableEditing = this.enableEditing.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.onInfoinputChange = this.onInfoinputChange.bind(this);
    }
    enableEditing() {

    }

    saveProperty() {

    }

    onInfoinputChange(inputName: string, value: string | boolean | number) {

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

type ChoosablePropertyInfoEditPanelProps = {
    choosableProperty: IChoosableProperty
}
type ChoosablePropertyInfoEditPanelState = {
    editingEnabled: boolean,
    choosableProperty: IChoosableProperty,
    saveResponse: {
        success: boolean,
        formError: string,
    }
}

class ChoosablePropertyInfoEditPanel extends React.Component <ChoosablePropertyInfoEditPanelProps, ChoosablePropertyInfoEditPanelState> {
    constructor(props: ChoosablePropertyInfoEditPanelProps) {
        super(props);

        this.onInfoinputChange = this.onInfoinputChange.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
    }
    onInfoinputChange(inputName: string, value: string | number | boolean) {

    }
    saveProperty() {

    }
    enableEditing() {
        this.setState({
            editingEnabled: true,
        })
    }
    redner() {
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

