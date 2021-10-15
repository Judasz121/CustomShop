import React from 'react';
import Constants from "../../router/constants"
import style from "../../styles/auth.module.css";



export default class EmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    textChange(e) {
        this.props.onTextChange(e.target.value, "email");
    }
    render() {
        return (
            <div className="username-input-group">
                E-mail:
                <input type="text" onChange={this.textChange} value={this.props.value} />
                <div className="input-error">{this.props.error}</div>
            </div>
        );
    }
}