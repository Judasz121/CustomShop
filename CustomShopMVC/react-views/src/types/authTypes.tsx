
export interface IRole {
    id: string,
    name: string,
}


export interface IUser {
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    emailConfirmed: boolean,
    lock: boolean,
}