import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";

/**
 * renders the top navigation menu
 * @param props auth state from redux
 * @constructor
 */
const TopNavigation = (props: any) => {

    const [loginLink,setLoginLink] = React.useState("");
    const [loginText, setLoginText] = React.useState("");
    const [registerText, setRegisterText] = React.useState(<div/>);

    const [profileNavigationBlock, setProfileNavigationBlock] = React.useState(<Nav.Link href={""}>Profile</Nav.Link>)

    useEffect( () => {initialize()},[]);


    const initialize = () => {
        if (props.auth.isAuthenticated) {
            setLoginLink('/logout');
            setLoginText('Logout');
        } else {
            setProfileNavigationBlock(
                <Nav.Link href={"/profile/" + "61bc5a60-9666-4ea2-8f7f-906e93efd610"}>Profile</Nav.Link>
            );
            setLoginLink('/login');
            setLoginText('Login');
            setRegisterText(
                <Nav.Link href='register'>Register now!</Nav.Link>
            );
        }
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Lisk Marketplace</Navbar.Brand>
                {profileNavigationBlock}
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
const mapStateToProps = (state: any) => {
    return {
        auth: state.auth
    };
};


export default withRouter(connect(mapStateToProps)(TopNavigation));
