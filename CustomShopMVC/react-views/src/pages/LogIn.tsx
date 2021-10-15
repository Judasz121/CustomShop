import React from 'react';
import LogInUserBox  from "../components/authorizationComponents/LogInUserBox"

class LogInPage extends React.Component {
    render() {
        return (
            <div id="logInPage">
                this is a logInpage content
                <LogInUserBox />
            </div>
        )
    }
}
export default LogInPage;