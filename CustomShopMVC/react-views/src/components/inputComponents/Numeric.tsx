import React, { ReactNode } from 'react';
import style from '../../styles/global.module.css';
import * as Icon from 'react-bootstrap-icons';

//type onChangeFunction = (inputName: string, value: string | boolean | number | File[] | File) => void;
type onChangeFunction = Function;

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