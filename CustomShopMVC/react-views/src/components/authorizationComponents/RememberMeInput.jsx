import React from 'react';
import Constants from "../../router/constants"
import style from "../../styles/auth.module.css";

export default class RememberMeInput extends React.Component {
    constructor(props) {
        super(props);
        this.stateChange = this.stateChange.bind(this);
    }
    stateChange(e) {
        this.props.onStateChange(e.target.checked, "rememberMe");
    }
    render() {
        return (
            <label className="remember-me-checkbox">
                <input type="checkbox" onChange={this.stateChange} checked={this.props.value} /> Remember Me
                <div className="input-error">{this.props.error}</div>
            </label>
        )
    }
}
