import React, { ReactNode } from 'react';
import style from '../../styles/global.module.css';
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
