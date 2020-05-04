/**
 * wrapper for the dispatch redux login
 * @param user user to save
 */
export function login(user : any) {
    return (dispath: any) => {
        dispath({
            type: 'LOGIN',
            payload: user
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