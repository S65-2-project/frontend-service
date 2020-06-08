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

    const [loginLink, setLoginLink] = React.useState("");
    const [loginText, setLoginText] = React.useState("");
    const [registerText, setRegisterText] = React.useState(<div/>);

    const [profileNavigationBlock, setProfileNavigationBlock] = React.useState(<div/>)

    useEffect(() => {
        const initialize = () => {
            if (props.auth.isAuthenticated) {
                setLoginLink('/logout');
                setLoginText('Logout');
                setProfileNavigationBlock(
                    <Nav.Link href={"/profile/" + props.auth.User.id}>My Profile</Nav.Link>
                );
                setRegisterText(
                    <div/>
                );
            } else {
                setLoginLink('/login');
                setLoginText('Login');
                setRegisterText(
                    <Nav.Link href='register'>Register now!</Nav.Link>
                );
                setProfileNavigationBlock(<div/>);
            }
        };
        initialize()
    }, [props.auth]);

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Lisk Marketplace</Navbar.Brand>
                {profileNavigationBlock}
                <Nav.Link href={"/delegate-overview"}>Delegates</Nav.Link>
                <Nav.Link href={"/create-dapp"}>Create Dapp</Nav.Link>
                <Nav.Link href={"/create-delegate"}>Become Delegate</Nav.Link>
                <Nav.Link href={"/chat"} >Chat</Nav.Link>
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
