import {Redirect, withRouter} from "react-router";
import {connect} from "react-redux";
import React from "react";
import {Alert, Button, Form} from "react-bootstrap";
import './Register.css'
import config from '../config.json'

interface IAuthenticateUser {
    Email: string;
    Password: string;
}

/**
 * renders the login component
 * @param props auth state form redux
 * @constructor
 */
const Login = (props : any) => {
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState();

    /**
     * validates email, password and passwordrepeat. Also sets error when it did not pass.
     * @returns false when the input does not match the given criteria.
     */
    const validateInput = (): boolean => {
        //check if passwords are the same
        if (password !== passwordRepeat){
        setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
            <Alert.Heading>The passwords do not match!</Alert.Heading>
        </Alert>)
        return false;
        }

        //checks if the given password meets criteria
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,32}$/;
        if (!password.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>The password does have atleast 1 small letter, 1 capital letter, 1 special number, 1 number and between 8 and 32 characters</Alert.Heading>
                <p>The password is not correct</p>
            </Alert>)
            return false;
        }

        //checks if the given email is valid
        reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!email.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>The email is not valid!</Alert.Heading>
            </Alert>)
            return false;
        }
        return true;
    }

    /**
     * handles a register event and sends it to the backend
     * @param event on register button press
     */
    const handleRegister = async (event: any) => {
        //validates input
        if (!validateInput()) {
            event.preventDefault();
            return false;
        }

        //creates user JSON object
        let user : IAuthenticateUser = {
            Email: email,
            Password: password
        };

        //create request parameters
        let options : RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        };

        //send API call to the Account server
        let response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL, options);

        //show error and stop flow
        if (response.status >= 400) {
            let errortext = await response.body;
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>{errortext}</Alert.Heading>
            </Alert>);
            event.preventDefault();
            return false;
        }

        props.history.push("/");
    }

    /**
     * changes email from event
     * @param event from the textbox
     */
    const onEmailChange = (event : any) => {
        setEmail(event.target.value);
    }

    /**
     * changes password from event
     * @param event from the textbox
     */
    const onPasswordChange = (event : any) => {
        setPassword(event.target.value);
    }

    /**
     * changes passwordrepeat from event
     * @param event from the textbox
     */
    const onPasswordRepeatChange = (event : any) => {
        setPasswordRepeat(event.target.value);
    }

    //creates an redirect when the user is already authenticated
    let content = props.auth.isAuthenticated ?
        (
            <Redirect to={{
                pathname: '/'
            }} />
        ) :
        (
            <Form className={"form-container"} onSubmit={handleRegister} >
                {error}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={onEmailChange}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={onPasswordChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicPasswordRepeat">
                    <Form.Label>Password (repeat)</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={passwordRepeat} onChange={onPasswordRepeatChange}/>
                </Form.Group>
                <Button variant="primary" type="submit" href={"/"}>
                    Register now!
                </Button>
            </Form>
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

export default withRouter(connect(mapStateToProps)(Login));