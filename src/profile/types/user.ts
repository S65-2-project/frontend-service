export default interface User{
    id: string,
    email : string,
    isDelegate: boolean,
    isDAppOwner: boolean,
    token : string
};

export const initialUserState : User ={
    id : "",
    email : "",
    isDelegate : false,
    isDAppOwner : false,
    token : ""
};