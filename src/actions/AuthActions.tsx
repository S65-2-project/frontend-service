/**
 * wrapper for the dispatch redux login
 * @param token jwt from the user
 */
export function login(token : any) {
    return (dispath: any) => {
        dispath({
            type: 'LOGIN',
            payload: token
        });
    }
}

/**
 * wrapper for the dispatch redux logout
 */
export function logout() {
    return (dispath: any) => {
        dispath({
            type: 'LOGOUT',
            payload: ``
        });
    };
}