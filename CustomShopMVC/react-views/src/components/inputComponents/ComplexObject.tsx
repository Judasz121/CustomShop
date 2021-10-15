import React, { ReactNode } from 'react';
import style from '../../styles/global.module.css';
import * as Icon from 'react-bootstrap-icons';
import { TextInfoInput } from './Text';
import { CheckBoxInfoInput } from './Boolean';

//type onChangeFunction = (inputName: string, value: string | boolean | number | File[] | File) => void;
type onChangeFunction = Function;

// #region InfoInputObjectList
// work in progress
type InfoInputObjectListProps = {
    items: InfoInputObjectList_PropsItem[],
    viewNames: InfoInputObjectListViewNames,
    editingEnabled: boolean,
    onChange: Function,
    inputName: string,
}
type InfoInputObjectListState = {
    newItemIdNumber: number,
}
type InfoInputObjectListViewNames = Record<string, string>

type InfoInputObjectList_PropsItem = {
    id: string,
    [key:string]: any,
}
export class InfoInputObjectList extends React.Component<InfoInputObjectListProps, InfoInputObjectListState> {
    constructor(props: InfoInputObjectListProps) {
        super(props);
        this.state = {
            newItemIdNumber: 0,
        }

        this.deleteListItem = this.deleteListItem.bind(this);
        this.addListItem = this.addListItem.bind(this);
        this.onChange = this.onChange.bind(this);

        this.clearObjectProperties = this.clearObjectProperties.bind(this);
        this.getViewName = this.getViewName.bind(this);
    }
    deleteListItem(id: string | number) {
        let arrayToSend: any[] = this.props.items.filter((item) => {
            return item.id != id;
        });
        this.props.onChange(this.props.inputName, arrayToSend);
    }

    clearObjectProperties(object: any) {
        var thisComponent = this;
        Object.keys(object).forEach(function (key, index) {
            if (typeof object[key] == "string")
                object[key] = "";
            else if (typeof object[key] == "number")
                object[key] = 0;
            else if (typeof object[key] == typeof "Object")
                object[key] = thisComponent.clearObjectProperties(object[key])
        });
        return object;
    }

    getViewName(name: string) {
        return name;
    }
    addListItem() {
        var newItem = this.props.items[0];

        this.clearObjectProperties(newItem);
        newItem.id = "new" + this.state.newItemIdNumber;
        this.setState({
            newItemIdNumber: this.state.newItemIdNumber + 1,
        });

        let arrayToSend: InfoInputObjectList_PropsItem[] = this.props.items.slice();
        arrayToSend.push(newItem);
        this.props.onChange(this.props.inputName, arrayToSend);
    }
    onChange(id: string) {
        let arrayToSend: InfoInputObjectList_PropsItem[] = this.props.items.slice();
        let itemToChange = arrayToSend.filter((item) => {
            return item.id == id;
        })[0];
        let index = arrayToSend.indexOf(itemToChange);
        arrayToSend[index] = itemToChange;

        this.props.onChange(this.props.inputName, arrayToSend);
    }
    render() {
        return (
            <div className={"InfoInputStringList " + style.editableList} >
                <button className={style.button} onClick={this.addListItem} >Add new</button>
                {this.props.items.map((item) => (
                    <InfoInputObjectList_InfoInputItem
                        data={item}
                        viewNames={this.props.viewNames}
                        editingEnabled={this.props.editingEnabled}
                        deleteItem={this.deleteListItem}
                        onChange={this.onChange}
                    />
                ))}

            </div>
        )
    }
}


type InfoInputObjectList_InfoInputItemProps = {
    onChange: Function,
    deleteItem: Function,
    editingEnabled: boolean,
    data: InfoInputObjectList_PropsItem,
    viewNames: InfoInputObjectListViewNames,
}
type InfoInputObjectList_InfoInputItemState = {

}
class InfoInputObjectList_InfoInputItem extends React.Component<InfoInputObjectList_InfoInputItemProps, InfoInputObjectList_InfoInputItemState>{
    constructor(props: InfoInputObjectList_InfoInputItemProps) {
        super(props);

        this.onInfoInputChange = this.onInfoInputChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.getObjectInputHtml = this.getObjectInputHtml.bind(this);
    }
    onInfoInputChange(inputName: string, value: string) {
        let edited = {
            ...this.props.data,
            [inputName]: value,
        };
        this.props.onChange(this.props.data.id, edited);
    }
    deleteItem(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.deleteItem(this.props.data.id)
    }
    getObjectInputHtml(obj: any) {
        var thisComponent = this;
        return (
            <div className="InfoInputObjectList_InfoInputItem">
                {
                    Object.keys(this.props.data).map((item, index) => {
                        var viewName = item;
                        var inputType;
                        var input;

                        if (typeof obj[item] == "string")
                            inputType = "text";
                        else if (typeof obj[item] == "number")
                            inputType = "number"
                        else if (typeof obj[item] == "boolean")
                            inputType = "checkbox";

                        if (typeof thisComponent.props.viewNames[item] != "undefined" && thisComponent.props.viewNames[item] != "")
                            viewName = thisComponent.props.viewNames[item];

                        if (typeof obj[item] == "string" || typeof obj[item] == "number")
                            input = <TextInfoInput
                                inputName={item}
                                editingEnabled={thisComponent.props.editingEnabled}
                                onChange={thisComponent.onInfoInputChange}
                                value={obj[item]}
                                placeholderValue={viewName}
                            />
                        else if (typeof obj[item] == "boolean")
                            input = <CheckBoxInfoInput
                                inputName={item}
                                editingEnabled={thisComponent.props.editingEnabled}
                                onChange={thisComponent.onInfoInputChange}
                                value={obj[item]}
                            />
                        else
                            input = thisComponent.getObjectInputHtml(obj[item])

                        return (
                            <div className="InfoInputObjectList_InfoInputItemProperty">
                                <span>{viewName}</span>
                                {input}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    
    render() {
        return (
            <div className={style.editableListItem}>
                {this.getObjectInputHtml(this.props.data)}
                <button onClick={this.deleteItem} ><Icon.Trash color="red" size={25} /> </button>
            </div>
        )
    }
}

// #endregion InfoInputList
