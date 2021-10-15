import React, { ReactNode } from 'react';
import style from '../../styles/global.module.css';
import * as Icon from 'react-bootstrap-icons';

//type onChangeFunction = (inputName: string, value: string | boolean | number | File[] | File) => void;
type onChangeFunction = Function;

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
