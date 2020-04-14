import {Redirect, withRouter} from "react-router";
import {connect} from "react-redux";
import React from "react";
import {Alert, Button, Form} from "react-bootstrap";
import './Register.css'

interface RegisterUser {
    Name: string;
    Password: string;
}

const Login = (props : any) => {
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState();

    const validateInput = () => {
        if (password === passwordRepeat){
        setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>The email is not correct</p>
        </Alert>)
        return false;
        }

        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,32}$/;
        if (!password.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>The password is not correct</p>
            </Alert>)
            return false;
        }

        reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!email.match(reg)){
            setError(<Alert variant="danger" onClose={() => setError(true)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>The email is not correct</p>
            </Alert>)
            return false;
        }
        return true;
    }


    const handleRegister = async (event: any) => {
        if (!validateInput()) {
            event.preventDefault();
            return false;
        }

        let options = {
            method: 'POST',
            headers: {},
            body: JSON.stringify('')
        }


        let response = await fetch("http://localhost:5000/Account", options)

    }

    const onEmailChange = (event : any) => {
        setEmail(event.target.value)
    }

    const onPasswordChange = (event : any) => {
        setPassword(event.target.value)
    }

    const onPasswordRepeatChange = (event : any) => {
        setPasswordRepeat(event.target.value)
    }

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
                <Button variant="primary" type="submit">
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

const mapStateToProps = (state : any) => {
    return {
        auth: state.auth
    };
};

export default withRouter(connect(mapStateToProps)(Login));