export class Constants {
    static baseUrl =
        window.location.port !== ""
        ? window.location.href.split("//")[0] + "//" + window.location.hostname + ":" + window.location.port
            : window.location.href.split("//")[0] + "//" + window.location.hostname;
    static urlPath = window.location.pathname;
    static emptyGuid = "00000000-0000-0000-0000-000000000000";

}
export default Constants;