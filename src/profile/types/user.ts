export default interface User{
    Id: string,
    Email : string,
    isDelegate: boolean,
    isdAppOwner: boolean,
    Token : string
};

export const initialUserState : User ={
    Id : "",
    Email : "",
    isDelegate : false,
    isdAppOwner : false,
    Token : ""
};