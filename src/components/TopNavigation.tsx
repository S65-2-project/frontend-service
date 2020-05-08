import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";

/**
 * renders the top navigation menu
 * @param props auth state from redux
 * @constructor 
 */
const TopNavigation = (props : any) => {

    let loginLink;
    let loginText;
    let registerText;

    if (props.auth.isAuthenticated) {
        loginLink = '/logout';
        loginText = 'Logout';
        registerText = ('');
    }
    else {
        loginLink = '/login';
        loginText = 'Login';
        registerText = (
            <Nav.Link href='register'>Register now!</Nav.Link>
        );
    }

    return (
        <div>
            <Navbar  bg="dark" variant="dark">
                <Navbar.Brand href="/">Lisk Marketplace</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="">
                        {registerText}
                        <Nav.Link href={loginLink}>{loginText}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
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


export default withRouter(connect(mapStateToProps)(TopNavigation));
