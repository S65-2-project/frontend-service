import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import {login} from '../actions/AuthActions';

/***
 * renders the login component
 * @param props auth state from redux
 * @constructor
 */
const Login = (props : any) => {
    let content = props.auth.isAuthenticated ?
        (
            <div>
                <Redirect to={{
                    pathname: '/'
                }} />
            </div>
        ) :
        (
            <div>
                <h1>Login pagina</h1>
            </div>
        );
    return (
        <div>
            {content}
        </div>
        );
};

/**
 * maps redux state to props
 * @param state of the redux
 */
const mapStateToProps = (state : any) => {
    return {
        auth: state.auth
    };
};

/**
 * maps redux dispatch to props
 * @param dispatch of the redux
 */
const mapDispatchToProps = (dispatch : any) => {
    return {
        login: (token :any) => {
            dispatch(login(token));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));