import React from 'react';
import Constants from "../../router/constants"
import style from "../../styles/auth.module.css";
import PasswordInput from './PasswordInput';
import UsernameOrEmailInput from './UsernameOrEmailInput';
import RememberMeInput from './RememberMeInput';

export default class LogInUserBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logInUrl: Constants.baseUrl + "/API/Auth/LogIn",
            inputs: {
                usernameOrEmail: "",
                password: "",
                rememberMe: false,
            },
            ajaxResponse: {
                usernameOrEmailError: "",
                passwordError: "",
                formError: "",
                ok: null,
            }
        }
        this.submit = this.submit.bind(this);
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
    }
    handleInputValueChange(value, input) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [input]: value,
            }
        });
    }
    submit(e) {
        e.preventDefault();
        var dataToSend = {
            "UsernameOrEmail": this.state.inputs.usernameOrEmail,
            "Password": this.state.inputs.password,
            "RememberMe": this.state.inputs.rememberMe,
        }
        fetch(this.state.logInUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    ajaxResponse: {
                        usernameOrEmailError: data.usernameOrEmailError,
                        passwordError: data.passwordError,
                        formError: data.formError,
                        ok: data.ok
                    }
                });
                if (data.ok)
                    this.loginSuccess();
            })
            .catch((error) => {
                console.log("logIn fetch error:" + error);
            })
    }
    loginSuccess() {
        alert("Successfully logged in.");
        if(this.props.successfullyLoggedIn != null)
            this.props.successfullyLoggedIn();
        window.location.reload();
    }

    render() {
        return (
            <div className="log-in-box">
                <UsernameOrEmailInput onTextChange={this.handleInputValueChange} value={this.state.inputs.usernameOrEmail} error={this.state.ajaxResponse.usernameOrEmailError} />
                <PasswordInput onTextChange={this.handleInputValueChange} value={this.state.inputs.password} error={this.state.ajaxResponse.passwordError} />
                <button onClick={this.submit} >Log in</button> <RememberMeInput onStateChange={this.handleInputValueChange} />
                <div className="formError">{this.state.ajaxResponse.formError}</div>
            </div>
        )
    }
}