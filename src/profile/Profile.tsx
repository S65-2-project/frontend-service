import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import User, {initialUserState} from "./types/user";
import config from "../config.json"
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Login from "../components/Login";
import {authenticationState} from "../reducers/AuthReducer";
import {Button, Form} from "react-bootstrap";


const Profile = (props: any) => {
    const [currentlyLoggedInUser, setCurrentlyLoggedInUser] = React.useState(initialUserState);

    /**
     * The id of the profile you want to see, will be filled in with page parameter. >> useParams
     */
    const [profileId, setProfileId] = React.useState();
    /**
     * user : user which will be displayed, and will be used in edit mode.
     * initialUserState has empty strings, and state false on isDelegate and isdAppOwner
     */
    const [user, setUser] = React.useState(initialUserState);
    //TODO: Change loading to a nice spinner prio:LOW
    const [profileInformationBlock, setProfileInformationBlock] = React.useState(<div>loading...</div>);
    const [editButton, setEditButton] = React.useState(<div/>)
    const [editMode, setEditMode] = React.useState(false);

    /**
     * Runs when page loads in and the userId is filled in. will run again when editmode has been changed.
     */
    useEffect(() => {
        initialize(editMode)
    }, [editMode]);

    /**
     * Method used for loading the userinformation
     * @param edit which indicates if the profile will be editable or not..
     */
    const initialize = async (edit: boolean) => {
        await setProfileId(useParams);
        await setCurrentlyLoggedInUser(props.auth.User);
        //checks if loggedInuser is the same as the profile you want to check, if it is then you have the option edit the profile.
        if (currentlyLoggedInUser.Id === profileId) {
            setUser(currentlyLoggedInUser);
            setInformationDisplay(currentlyLoggedInUser, true, edit);
        } else {
            await setUser(await GetUserInformation(profileId));
            setInformationDisplay(user, false, edit);
        }
    };

    /**
     * Method used for saving changes of a profile edit.
     */
    const saveChangesEdit = async () => {
        //TODO put request to server with model.
        await UpdateUserInformation(user);
        await setEditMode(false);

    };

    const onEmailChange = (event : any) => {
        user.Email = event.target.value;
    };

    const onIsDelegateChange = (event : any) => {
        user.isDelegate = event.target.value;
    };

    const onDAPPOwnerChange = (event : any) => {
      user.isdAppOwner = event.target.value;
    };

    /**
     * Changes the display of the render to match the userinformation.
     * @param user which contains the information
     * @param loggedIn indicates if the information display should contain an edit button.
     */
    const setInformationDisplay = (user: User, loggedIn: boolean, editMode: boolean) => {
        if (!editMode) {
            setProfileInformationBlock(
                <Form>
                    <Form.Group>
                        <Form.Label>email: {user.Email}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>is a delegate: {user.isDelegate}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>is dAppOwner: {user.isdAppOwner}</Form.Label>
                    </Form.Group>
                </Form>
            );
        } else {
            setProfileInformationBlock(
                <form>
                    <Form.Group>
                        <Form.Label>email</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" onChange={onEmailChange}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="is a delegate" onChange={onIsDelegateChange}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="is a dAppOwner" onChange={onDAPPOwnerChange}/>
                    </Form.Group>

                </form>
            )
        }
        if (loggedIn && !editMode) {
            setEditButton(<Button onClick={() => {
                setEditMode(true)
            }}>Edit</Button>);
        } else if (editMode) {
            setEditButton(<Button onClick={saveChangesEdit}>Save changes</Button>)
        } else {
            setEditButton(<div/>)
        }
    };

    return (
        <div>
            {profileInformationBlock}
            {editButton}
        </div>
    )
};

/**
 * maps redux state to props
 * @param state of the redux
 */
const mapStateToProps = (state: authenticationState) => {
    return {
        auth: state
    };
};

export default withRouter(connect(mapStateToProps)(Login));

export async function GetUserInformation(userId: string): Promise<User> {

    let options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    };
    /**
     * Url is now local TODO: change this when backend gets updated
     */
    try {
        let idRequest: string ="/"+userId; //TODO FILL THIS IN WHEN Backend has expectations.
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + idRequest);
        let body = await response.text();
        if (response.status === 200) {
            return JSON.parse(body); //returns type User if backend is consistent.
        } else {
            return initialUserState;
        }
    } catch (Exception) {
        console.log("PROFILE GET REQUEST EXCEPTION: " + Exception);
        return initialUserState;
    }
}

export async function UpdateUserInformation(user : User) : Promise<boolean> {
    let options: RequestInit = {
        method: "PUT",
        body : JSON.stringify(user),
        headers: {
            "Content-Type" : "application/json"
        },
        mode: "cors",
        cache: "default"
    };

    try{
        let response : Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL+"/"+user.Id, options);
        if(response.status == 200){
            return true;
        }
        else{
            return false;
        }
    }
    catch(Exception){
        console.log("EXCEPTION WHEN UPDATING USER: " + JSON.stringify(user)+" Exception: " + Exception)
        return false;
    }
};

