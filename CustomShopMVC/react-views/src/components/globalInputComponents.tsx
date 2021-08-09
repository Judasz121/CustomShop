import React from 'react';
import style from '../styles/global.module.css';

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