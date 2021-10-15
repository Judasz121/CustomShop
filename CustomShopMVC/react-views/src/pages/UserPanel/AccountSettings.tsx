import React from 'react';
import { CheckBoxSwitch } from '../../components/inputComponents/Boolean';
import Constants from '../../router/constants';
import style from '../../styles/userPanel.module.css';
import globalStyle from '../../styles/global.module.css';


type AccountSettingsPanelProps = {

}
type AccountSettingsPanelState = {
    settingsFetched: boolean,
    settings: {
        id: string,
        darkMode: boolean,
    },
    errors: {
        formError: string,
    }
}
export default class AccountSettingsPanel extends React.Component <AccountSettingsPanelProps, AccountSettingsPanelState>{
    constructor(props: AccountSettingsPanelProps) {
        super(props);
        this.state = {
            settingsFetched: false,
            settings: {
                id: "",
                darkMode: false,
            },
            errors: {
                formError: "",
            }
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
    }
    componentDidMount() {
        let dataUrl = Constants.baseUrl + "/API/UserPanel/GetSettings"
        fetch(dataUrl, {
            method: "GET",

        })
            .then(response => response.json())
            .then((data) => {
                console.log("recieved settings response");
                console.log(data);

                this.setState({
                    settings: data,
                });
            });
    }
    saveSettings() {
        let dataToSend = this.state.settings;
        let url = Constants.baseUrl + "/API/UserPanel/SaveSettings";
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then((data) => {
                if (data.success)
                    this.setState({
                        errors: {
                            formError: "Successfully saved",
                        }
                    })
            })
    }
    onInputChange(inputName: string, value: string | boolean | number) {
        console.log(inputName + " changed to " + value);
        this.setState({
            settings: {
                ...this.state.settings,
                [inputName]: value,
            }
        });
    }
    render() {
        let hiddenClass = this.state.settingsFetched ? "" : globalStyle.hidden;
        return (
            <div className={style.accountSettingsPanel} >
                <div className={style.hideContainer + hiddenClass} >
                    <label className={style.inputGroup}>
                        <CheckBoxSwitch
                            inputName="darkMode"
                            label="Dark Mode"
                            value={this.state.settings.darkMode}
                            onChange={this.onInputChange}
                        />
                    </label>
                </div>
                <button
                    onClick={this.saveSettings}
                    className={style.saveButton}
                >
                    Save
                </button>
            </div>
        );
    }
}