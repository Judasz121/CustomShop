export class Constants {
    static baseUrl =
        window.location.port !== ""
        ? window.location.href.split("//")[0] + "//" + window.location.hostname + ":" + window.location.port
            : window.location.href.split("//")[0] + "//" + window.location.hostname;
    static urlPath = window.location.pathname;
    static logInUrl = Constants.baseUrl + "/API/Auth/LogIn";
    static registerUrl = Constants.baseUrl + "/API/Auth/Register";
}
export default Constants;