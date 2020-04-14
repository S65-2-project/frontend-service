import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import {login} from '../actions/AuthActions';

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

const mapStateToProps = (state : any) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch : any) => {
    return {
        login: (token :any) => {
            dispatch(login(token));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));