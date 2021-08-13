import React from 'react';
import style from '../styles/globalInputs.module.css';
import { X as XIcon } from 'react-bootstrap-icons';


// #region TextInfoInput
type TextInfoInputProps = {
    onChange: Function,
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

// #region CheckBoxInfoInput

type CheckBoxInfoInputProps = {
    onChange: Function,
    editingEnabled:boolean,
    value: boolean,
    inputName: string,
    label: string,
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
            />
        else
            input = <input
                type="checkbox"
                disabled
                checked={this.props.value}
            />

        return (
            <label className="CheckBoxInfoInput">
                {this.props.label + " "} 
                {input}
            </label>
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

// #region EditableList

type EditableListProps = {
    items: EditableListPropItem[],
    editingEnabled: boolean,
    onChange: Function,
    inputName: string,
}
type EditableListState = {

}
type EditableListPropItem = {
    value: string,
    id: string | number,
}

export class EditableList extends React.Component<EditableListProps, EditableListState> {
    constructor(props: EditableListProps) {
        super(props);
        this.deleteListItem = this.deleteListItem.bind(this);
        this.addListItem = this.addListItem.bind(this);
    }
    deleteListItem(id: string | number) {
        let arrayToSend: EditableListPropItem[] = this.props.items.filter((item) => {
            return item.id != id;
        });
        this.props.onChange(this.props.inputName, arrayToSend);
    }
    addListItem() {
        var newItem: EditableListPropItem;
        if (typeof this.props.items[0].id == 'number') {
            //newItem = {
            //    id
            //}
        }
    }
    onChange(id: string | number) {
        let arrayToSend: EditableListPropItem[] = this.props.items;
        let itemToChange = arrayToSend.filter((item) => {
            return item.id == id;
        })[0];
        let index = arrayToSend.indexOf(itemToChange);
        arrayToSend[index] = itemToChange;

        this.props.onChange(this.props.inputName, arrayToSend);
    }
    render() {
        if (this.props.editingEnabled)
            return (
                <div className={style.editableList} >
                    {this.props.items.map((item) => (
                        <EditableListItem
                            value={item.value}
                            id={item.id}
                            deleteItem={this.deleteListItem}
                            onChange={this.onChange}
                            addItem={this.addListItem}
                        />
                    ))}

                </div>
            )
        else
            return (
                <div className={style.editableList + " " + style.editingDisabled} >
                    {this.props.items.map((item) => (
                        <div className={style.editableListItem + " " + style.editingDisabled} >
                            {item.value}
                        </div>
                    ))}
                </div>
            )
    }
}


type EditableListItemProps = {
    onChange: Function,
    deleteItem: Function,
    addItem: Function,
    value: string,
    id: number | string,
}
type EditableListItemState = {

}

class EditableListItem extends React.Component<EditableListItemProps, EditableListItemState>{
    constructor(props: EditableListItemProps) {
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
    addItem() {
        this.props.addItem();
    }

    render() {
        return (
            <div className={style.editableListItem}>
                <input onChange={this.onChange} value={this.props.value} type="text" />
                <button onClick={this.deleteItem} ><XIcon /> </button>
            </div>
        )
    }
}

// #endregion EditableList