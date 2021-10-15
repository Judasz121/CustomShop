import React from 'react';
import RegisterUserBox  from "../components/authorizationComponents/RegisterUserBox";

class RegisterPage extends React.Component {
    render() {
        return (
            <div id="registerPage">
                this is register page content
                <RegisterUserBox/>
            </div>
        )
    }
}
export default RegisterPage;