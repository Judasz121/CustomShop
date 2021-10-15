import React from 'react';
import Constants from "../../router/constants"
import style from "../../styles/auth.module.css";



export default class RegisterUserBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                username: "",
                email: "",
                password: ""
            },
            ajaxResponse: {
                usernameError: "",
                emailError: "",
                passwordError: "",
                formError: "",
                ok: false,
            }
        }
        this.submit = this.submit.bind(this);
        this.handleInputTextChange = this.handleInputTextChange.bind(this);
        this.registerSuccess = this.registerSuccess.bind(this);
    }
    handleInputTextChange(value, input) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [input]: value
            }
        });
    }
    submit(e) {
        e.preventDefault();
        var url = Constants.baseUrl + "/API/Auth/Register";
        var dataToSend = {
            "Email": this.state.inputs.email,
            "Password": this.state.inputs.password,
            "Username": this.state.inputs.username
        }
        fetch(url, {
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
                        usernameError: data.usernameError,
                        emailError: data.emailError,
                        passwordError: data.passwordError,
                        formError: data.formError,
                        ok: data.ok
                    }
                });
                if (data.ok)
                    this.registerSuccess();
            })
            .catch((error) => {
                console.log("register fetch() error:" + error);
            })
        //$.ajax({
        //    url: this.state.registerUrl,
        //    type: "POST",
        //    data: dataToSend,
        //    success: (result) => {
        //        this.state.ajaxResponse.usernameError = result.usernameError;
        //        this.state.ajaxResponse.emailError = result.emailError;
        //        this.state.ajaxResponse.passwordError = result.passwordError;
        //        this.state.ajaxResponse.formError = result.formError;
        //        this.state.ajaxResponse.ok = result.ok;
        //        this.forceUpdate();
        //        if (result.ok == true)
        //            this.registerSuccess();
        //    }
        //})
    }
    registerSuccess() {
        alert("Successfully registered, you can now log in");
        this.props.successfullyRegistered();
    }
    render() {
        return (
            <div className={style.registerBox}>
                <UsernameInput onTextChange={this.handleInputTextChange} value={this.state.inputs.username} error={this.state.ajaxResponse.usernameError} />
                <EmailInput onTextChange={this.handleInputTextChange} value={this.state.inputs.email} error={this.state.ajaxResponse.emailError} />
                <PasswordInput onTextChange={this.handleInputTextChange} value={this.state.inputs.password} error={this.state.ajaxResponse.passwordError} />
                <button onClick={this.submit} >Register</button>
                <div className="formError">{this.state.ajaxResponse.formError}</div>
            </div>

        )
    }
}

class UsernameInput extends React.Component{
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
class PasswordInput extends React.Component {
    constructor(props) {
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    textChange(e) {
        this.props.onTextChange(e.target.value, "password");
    }
    render() {
        return (
            <div className="username-input-group">
                Password:
                <input type="password" onChange={this.textChange} value={this.props.value} />
                <div className="input-error">{this.props.error}</div>
            </div>
        );
    }
}

class EmailInput extends React.Component {
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


class UsernameOrEmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.textChange = this.textChange.bind(this);
    }
    textChange(e) {
        this.props.onTextChange(e.target.value, "usernameOrEmail");
    }
    render() {
        return (
            <div className="username-input-group">
                Username:
                <input type="text" onChange={this.textChange} value={this.props.value} />
                <div className="input-error">{this.props.error}</div>
            </div>
        );
    }
}

class RememberMeInput extends React.Component {
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

export class LogInUserBox extends React.Component {
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
        //$.ajax({
        //    url: this.state.logInUrl,
        //    type: "POST",
        //    data: dataToSend,
        //    success: (result) => {
        //        console.log(result);
        //        this.state.ajaxResponse.usernameOrEmailError = result.usernameOrEmailError;
        //        this.state.ajaxResponse.passwordError = result.passwordError;
        //        this.state.ajaxResponse.formError = result.formError;
        //        this.state.ajaxResponse.ok = result.ok;
        //        this.forceUpdate();
        //        if (result.ok == true)
        //            this.loginSuccess();
        //    }
        //})
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