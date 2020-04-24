/**
 * reducer for the authentication functions
 * @param state contains an isAuthenticated boolean and a user string
 * @param action type of action to handle
 */
const authReducer = (state = {
    user: '',
    isAuthenticated: false
}, action : any) => {
    switch (action.type) {
        //in case of login save the token as user and set authenticated
        case 'LOGIN':
            state = { ...state, user: action.payload, isAuthenticated: true };
            break;
        //in case of logout remove the token and unset authenticated
        case 'LOGOUT':
            state = { ...state, user: '', isAuthenticated: false };
            break;
        default:
            break;
    };
    return state;
};

export default authReducer;