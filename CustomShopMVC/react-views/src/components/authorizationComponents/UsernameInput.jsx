import React from 'react';
import Constants from "../../router/constants"
import style from "../../styles/auth.module.css";


export default class UsernameInput extends React.Component{
    constructor(props) {
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    textChange(e) {
        this.props.onTextChange(e.target.value, "username");
    }
    render() {
        return (
            <div className = "username-input-group">
                Username:
                <input type="text" onChange={this.textChange} value={this.props.value} />
                <div className="input-error">{this.props.error}</div>
            </div>
        );
    }
}
