import React, { ReactNode } from 'react';
import style from '../styles/global.module.css';
import * as Icon from 'react-bootstrap-icons';

//type onChangeFunction = (inputName: string, value: string | boolean | number | File[] | File) => void;
type onChangeFunction = Function;

// #region TextInfoInput
type TextInfoInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    value: string,
    inputName: string,
    placeholderValue: string,

}
type TextInfoInputState = {

}
export class TextInfoInput extends React.Component <TextInfoInputProps, TextInfoInputState>{
    constructor(props: TextInfoInputProps) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.value);
    }
    render() {
        var content = null;
        if (this.props.editingEnabled)
            content = <input
                onChange={this.handleValueChange}
                value={this.props.value}
                name={this.props.inputName}
                placeholder={this.props.placeholderValue}
            />

        else
            content = <div className="info">{this.props.value}</div>

        return (
            <span className="TextInfoInput">
                {content}
            </span>
        )
    }
}

// #endregion TextInfoInput

//#region NumberInfoInput
type NumberInfoInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    value: number | null,
    inputName: string,

}
type NumberInfoInputState = {

}
export class NumberInfoInput extends React.Component<NumberInfoInputProps, NumberInfoInputState>{
    constructor(props: NumberInfoInputProps) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.value);
    }
    render() {
        var content = null;
        if (this.props.editingEnabled)
            content = <input
                onChange={this.handleValueChange}
                type="number"
                value={this.props.value || ''}
                name={this.props.inputName}
            />

        else
            content = <div className="info">{this.props.value}</div>

        return (
            <span className="TextInfoInput">
                {content}
            </span>
        )
    }
}

//#endregion NumberInfoInput

//#region TextAreaInfoInput
type TextAreaInfoInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    value: string,
    inputName: string,
    placeholderValue: string,
}
type TextAreaInfoInputState = {

}
export class TextAreaInfoInput extends React.Component <TextAreaInfoInputProps, TextAreaInfoInputState> {
    constructor(props: TextAreaInfoInputProps) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        console.log("textareaChange");
        console.log(e);
        this.props.onChange(this.props.inputName, e.target.value);
    }
    render() {
        var content = null;
        if (this.props.editingEnabled)
            content = <textarea
                onChange={this.handleValueChange}
                value={this.props.value}
                name={this.props.inputName}
                placeholder={this.props.placeholderValue}
            />

        else
            content = <div className="info">{this.props.value}</div>

        return (

            <span className="TextAreaInfoInput">
                {content}
            </span>
        )
    }
}

//#endregion

// #region CheckBoxInfoInput

type CheckBoxInfoInputProps = {
    onChange: Function,
    editingEnabled:boolean,
    value: boolean,
    inputName: string,
}
type CheckBoxInfoInputState = {

}
export class CheckBoxInfoInput extends React.Component<CheckBoxInfoInputProps, CheckBoxInfoInputState>{
    constructor(props: CheckBoxInfoInputProps) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this)
    }
    handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.checked);
    }
    render() {
        let input;
        if (this.props.editingEnabled)
            input = <input
                type="checkbox"
                name={this.props.inputName}
                onChange={this.handleValueChange}
                checked={this.props.value}
                className="CheckBoxInfoInput"
            />
        else
            input = <input
                type="checkbox"
                disabled
                checked={this.props.value}
                className="CheckBoxInfoInput"
            />

        return (
            <div className="CheckBoxInfoInput">
                {input}
            </div>
        )
    }
}
// #endregion CheckBoxInfoInput

// #region CheckBoxSwitch
type CheckBoxSwitchProps = {
    value: boolean,
    label: string,
    onChange: Function,
    inputName: string,
}
type CheckBoxSwitchState = {

}
export class CheckBoxSwitch extends React.Component<CheckBoxSwitchProps, CheckBoxSwitchState>{
    constructor(props: CheckBoxSwitchProps) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }
    handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.checked);
    }
    render() {
        return (
            <label className="CheckBoxSwitch" >
                {this.props.label + " "}
                <label className={style.switchCheckbox} >
                    <input
                        type="checkbox"
                        checked={this.props.value}
                        onChange={this.handleValueChange}
                        name={this.props.inputName}
                    />
                    <span className={style.switchCheckboxSlider}></span>

                </label>
            </label>

        )
    }
}
// #endregion CheckBoxSwitch

//#region ImageInfoInput
export type ImageInfoInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    inputName: string,
    image: File,
    imagePath: string,
}
type ImageInfoInputState = {
    uploadedImage: File,
    imageUrl: string,
}
export class ImageInfoInput extends React.Component<ImageInfoInputProps, ImageInfoInputState>{
    constructor(props: ImageInfoInputProps) {
        super(props);
        this.state = {
            uploadedImage: this.props.image,
            imageUrl: this.props.imagePath,
        }

        this.onInputChange = this.onInputChange.bind(this);
    }
    onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.inputName, e.target.files![0]);
        this.setState({
            uploadedImage: e.target.files![0],
            imageUrl: URL.createObjectURL(e.target.files![0]),
        })
    }
    render() {
        var content;
        if (this.props.editingEnabled)
            content = (
                <div className="inputGroup">
                    <img src={this.state.imageUrl} className="info" />
                    <input type="file" onChange={this.onInputChange} />
                </div>
                )
        else
            content = <img src={""} className="info" />
        return (
            <div className="ImageInfoInput">
                {content}
            </div>
        )
    }
}

//#endregion

//#region ImagesInput
export type ImagesInputProps = {
    onChange: onChangeFunction,
    editingEnabled: boolean,
    inputName: string,
    value: File[],
}
type ImagesInputState = {
    items: ImagesInput_ImageItem[],
    newItemIdNum: number,
}
type ImagesInput_ImageItem = {
    id: number,
    file: File,


}
export class ImagesInput extends React.Component<ImagesInputProps, ImagesInputState>{
    constructor(props: ImagesInputProps) {
        super(props);

        let imageItems: ImagesInput_ImageItem[] = [];
        let i = 0;
        if(this.props.value)
        for ( ; i < this.props.value.length; i++) {
            let newItem: ImagesInput_ImageItem = {
                id: i,
                file: this.props.value[i],
            }
            imageItems.push(newItem);
        }
        this.state = {
            items: imageItems,
            newItemIdNum: i,
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    deleteImage(id: number) {
        let itemToDelete = this.state.items.filter((item) => item.id == id)[0];
        let index = this.state.items.indexOf(itemToDelete)
        let newItems = this.state.items.slice();
        newItems.splice(index, 1);

        this.setState({
            items: newItems,
        })

        let imagesToSend: File[] = newItems.map((item) => item.file);
        this.props.onChange(this.props.inputName, imagesToSend);
    }

    onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let idNum = this.state.newItemIdNum;
        let newItems: ImagesInput_ImageItem[] = [];

        for (var i = 0; i < e.target.files!.length; i++) {
            let newItem: ImagesInput_ImageItem = {
                id: idNum,
                file: e.target.files![i],
            }
            newItems.push(newItem);
            idNum++;
        }
        newItems = newItems.concat(this.state.items);
        this.setState({
            items: newItems,
            newItemIdNum: idNum,
        });

        let filesToReturn: File[] = newItems.map((item) => item.file);
        this.props.onChange(this.props.inputName, filesToReturn);
    }
    render() {
        return (
            <div className="ImagesInput">
                <input type="file" onChange={this.onInputChange} multiple />
            </div>
        )
    }
}

//#endregion ImagesInput

// #region InfoInputStringList

type InfoInputStringListProps = {
    items: string[],
    editingEnabled: boolean,
    onChange: Function,
    inputName: string,
}
type InfoInputStringListState = {
    editedItems: InfoInputStringList_StateItem[],
}
type InfoInputStringList_StateItem = {
    id: number,
    value: string,
}


export class InfoInputStringList extends React.Component<InfoInputStringListProps, InfoInputStringListState> {
    constructor(props: InfoInputStringListProps) {
        super(props);
        this.state = {
            editedItems: this.props.items.map((item, index) => {
                let newItem: InfoInputStringList_StateItem = {
                    id: index,
                    value: item,
                }
                return newItem;
            }),

        }
        

        this.deleteListItem = this.deleteListItem.bind(this);
        this.addListItem = this.addListItem.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    deleteListItem(id: number) {
        let filtered = this.state.editedItems.filter((item) => {
            return id != item.id;
        });
        let toSend = filtered.map((item) => item.value);
        this.setState({
            editedItems: filtered,
        });

        this.props.onChange(this.props.inputName, toSend);
    }
    addListItem() {
        let newId = Math.max.apply(Math, this.state.editedItems.map((item) => item.id)) + 1;
        if (newId == -Infinity)
            newId = 0;
        let newItem: InfoInputStringList_StateItem = {
            id: newId,
            value: "",
        };
        this.setState({
            editedItems: [
                ...this.state.editedItems,
                newItem,
            ],
        });

        let arrayToSend: string[] = this.state.editedItems.map((item) => item.value);
        arrayToSend.push(newItem.value);
        this.props.onChange(this.props.inputName, arrayToSend);
    }
    onChange(id: number, value: string) {

        let editedItems: InfoInputStringList_StateItem[] = this.state.editedItems.slice();
        let itemToChange = editedItems.filter((item) => {
            return item.id == id;
        })[0];
        let index = editedItems.indexOf(itemToChange);
        itemToChange.value = value;
        editedItems[index] = itemToChange;

        this.setState({
            editedItems: editedItems,
        });

        this.props.onChange(this.props.inputName, editedItems.map((item) => item.value));
    }
    render() {
        return (
            <div className={"InfoInputStringList " + style.editableList} >
                <button className={style.button} onClick={this.addListItem} >Add new</button>
                {this.state.editedItems.map((item) => (
                    <InfoInputStringList_InfoInputItem
                        value={item.value}
                        id={item.id}
                        deleteItem={this.deleteListItem}
                        onChange={this.onChange}
                        editingEnabled={this.props.editingEnabled}
                        key={item.id}
                    />
                ))}

            </div>
        )
    }
}


type InfoInputStringList_InputItemProps = {
    onChange: Function,
    deleteItem: Function,
    value: string,
    id: number | string,
    editingEnabled: boolean,
}
type InfoInputStringList_InputItemState = {

}
class InfoInputStringList_InfoInputItem extends React.Component<InfoInputStringList_InputItemProps, InfoInputStringList_InputItemState>{
    constructor(props: InfoInputStringList_InputItemProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }
    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(this.props.id, e.target.value)
    }
    deleteItem(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.deleteItem(this.props.id)
    }

    render() {
        if (this.props.editingEnabled)
            return (
                <div className={"InfoInputStringList_Item"}>
                    <input onChange={this.onChange} value={this.props.value} type="text" />
                    <button onClick={this.deleteItem} ><Icon.Trash color="red" size={25} /> </button>
                </div>
            )
        else
            return (
                <div className={"InfoInputStringList_Item"}>
                    {this.props.value}
                </div>
                )
    }
}

// #endregion InfoInputStringList

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
