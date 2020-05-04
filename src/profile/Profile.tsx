import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import User, {initialUserState} from "./types/user";
import config from "../config.json"
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {authenticationState} from "../reducers/AuthReducer";
import {Button, Form} from "react-bootstrap";
import {ChangePasswordModel} from "./types/ChangePasswordModel";


const Profile = (props: any) => {
    //Boolean that indicates if the user is in edit mode or not.
    let editMode: boolean = false;
    const {id} = useParams();
    /**
     * Runs when page loads in and the userId is filled in. will run again when editmode has been changed.
     */
    useEffect(() => {
        initialize(id ?? "", editMode)
    }, [editMode]);

    /**
     * User that is currently logged in which is obtained from the react-redux.
     */
    let currentlyLoggedInUser: User = initialUserState;

    /**
     * The id of the profile you want to see, will be filled in with page parameter. >> useParams
     */
    let profileId = "";

    /**
     * user : user which will be displayed, and will be used in edit mode.
     * initialUserState has empty strings, and state false on isDelegate and isdAppOwner
     */
    let profileUser: User = initialUserState;

    //Html block that contains the information to display, or to edit.
    const [profileInformationBlock, setProfileInformationBlock] = React.useState(<div>loading...</div>);

    //Html block which contains the enter edit button and save changes from edit.
    const [editButton, setEditButton] = React.useState(<div/>)

    //Html block which contains the fields oldpassword, newpassword, repeatnewpassword.
    const [passwordBlock, setPasswordBlock] = React.useState(<div/>);



    //Boolean which indicates if the user has decided to change to password.
    let changePassword : boolean = false;

    //String which has the oldPassword
    let oldPassword: string = "";
    //String which has the newPassword
    let newPassword: string = "";
    //String which has the repeatNewPassword
    let repeatNewPassword: string = "";


    /**
     * Method used for loading/reloading the userinformation
     * @param edit which indicates if the profile will be editable or notm this boolean also sets the editmode parameter.
     */
    async function initialize(id: string, edit: boolean) {
        profileId = id;
        currentlyLoggedInUser = props.auth.User;
        editMode = edit;
        //checks if loggedInuser is the same as the profile you want to check, if it is then you have the option edit the profile.
        if (currentlyLoggedInUser) {
            if (currentlyLoggedInUser.id === profileId) {
                profileUser = currentlyLoggedInUser;
                setInformationDisplay(currentlyLoggedInUser, true, edit);
            }
        }
        else {
            profileUser = await GetUserInformation(id);
            console.log(profileUser);
            setInformationDisplay(profileUser, false, edit);
        }
    };

    /**
     * Method used for saving changes of a profile edit.
     */
    const saveChangesEdit = async () => {
        await UpdateUserInformation(profileUser);
        if (changePassword && oldPassword !== "" && newPassword !== "" && repeatNewPassword !== "") {
            await ChangePassword(profileUser.id, oldPassword, newPassword);
        } else {
            //ignore
        }
        await initialize(profileId, false);
    };


    const onEmailChange = (event: any) => {
        profileUser.email = event.target.value;
    };

    const onIsDelegateChange = (event: any) => {
        profileUser.isDelegate = event.target.value;
    };

    const onDAPPOwnerChange = (event: any) => {
        profileUser.isDAppOwner = event.target.value;
    };

    const onChangeOldPassword = (event: any) => {
        oldPassword = event.target.value;
    };

    const onChangeNewPassword = (event: any) => {
        newPassword=event.target.value;
    };

    const onChangeNewRepeatPassword = (event: any) => {
        repeatNewPassword = event.target.value;
    };

    //Method that is used for changing the edit passwordblock
    const setChangePasswordBlock = (event: any) => {
        changePassword = event.target.value;
        if (event.target.value) {
            setPasswordBlock(editPasswordBlock);
        } else {
            setPasswordBlock(<div/>);
        }
    };

    /**
     *  Html Block that is used if you decide to edit the password.
     */
    const editPasswordBlock = () => {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Old password</Form.Label>
                    <Form.Control type="password" placeholder="enter old password" onChange={onChangeOldPassword}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="password" placeholder="enter new password" onChange={onChangeNewPassword}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Repeat new password</Form.Label>
                    <Form.Control type="password" placeholder="repeat new password"
                                  onChange={onChangeNewRepeatPassword}/>
                </Form.Group>
            </Form>
        )
    };

    /**
     * Html Block that is used when just viewing a profile.
     * @param user which contains display information.
     */
    const profileInformationBlockNotEdit = (user: User) => {
        console.log("dasdas" + JSON.stringify(user));
        return (
            <Form>
                <Form.Group>
                    <Form.Label>email: {user.email}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>is a delegate: {user.isDelegate.toString()}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>is dAppOwner: {user.isDAppOwner.toString()}</Form.Label>
                </Form.Group>
            </Form>
        )
    };

    /**
     * Html Block that is used when editing a profile.
     */
    const profileInformationBlockEditMode = () => {
        return (
            <form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Enter email" onChange={onEmailChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="is a delegate" onChange={onIsDelegateChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="is a dAppOwner" onChange={onDAPPOwnerChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="changePassword" onChange={setChangePasswordBlock}/>
                </Form.Group>

                {passwordBlock}
            </form>
        )
    };

    /**
     * Changes the display of the render to match the userinformation.
     * @param user which contains the information
     * @param loggedIn indicates if the information display should contain an edit button.
     */
    const setInformationDisplay = (user: User, loggedIn: boolean, edit: boolean) => {
        console.log(user);
        //profile block that is variable to edit and non edit mode.
        if (!edit) {
            console.log("1!");
            setProfileInformationBlock(
                profileInformationBlockNotEdit(user)
            );
        } else {
            console.log("2!");
            setProfileInformationBlock(
                profileInformationBlockEditMode
            );
        }

        //Button that you can use if you are logged to start and save edit.
        if (loggedIn && !edit) {
            console.log("3!");
            setEditButton(<Button onClick={() => {
                initialize(profileId, true);
            }}>Edit</Button>);
        } else if (edit && loggedIn) {
            console.log("4!");
            setEditButton(<Button onClick={saveChangesEdit}>Save changes</Button>)
        } else {
            console.log("5!");
            setEditButton(<div/>)
        }
        console.log("end!")
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

export default withRouter(connect(mapStateToProps)(Profile));

export async function GetUserInformation(userId: string): Promise<User> {
    let options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    };

    try {
        let idRequest: string = "/" + userId;
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + idRequest, options);
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

export async function UpdateUserInformation(user: User): Promise<boolean> {
    let options: RequestInit = {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    };

    try {
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + "/" + user.id, options);
        return response.status === 200;
    } catch (Exception) {
        console.log("EXCEPTION WHEN UPDATING USER: " + JSON.stringify(user) + " Exception: " + Exception)
        return false;
    }
}

export async function ChangePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    let passwordModel: ChangePasswordModel = {
        OldPassword: oldPassword,
        NewPassword: newPassword
    };

    let options: RequestInit = {
        method: "PUT",
        body: JSON.stringify(passwordModel),
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    };

    try {
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + "/" + userId, options);
        return response.status === 200;
    } catch (e) {
        console.log("CHANGEPASSWORD EXPECTION: " + e);
        return false;
    }


}

