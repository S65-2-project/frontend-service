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
    /**
     * User that is currently logged in which is obtained from the react-redux.
     */
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

    //Html block that contains the information to display, or to edit.
    const [profileInformationBlock, setProfileInformationBlock] = React.useState(<div>loading...</div>);

    //Html block which contains the enter edit button and save changes from edit.
    const [editButton, setEditButton] = React.useState(<div/>)

    //Html block which contains the fields oldpassword, newpassword, repeatnewpassword.
    const [passwordBlock,setPasswordBlock] = React.useState(<div/>);

    //Boolean that indicates if the user is in edit mode or not.
    const [editMode, setEditMode] = React.useState(false);

    //Boolean which indicates if the user has decided to change to password.
    const [changePassword,setChangePassword] = React.useState(false);

    //String which has the oldPassword
    const [oldPassword, setOldPassword] = React.useState("");
    //String which has the newPassword
    const [newPassword, setNewPassword] = React.useState("");
    //String which has the repeatNewPassword
    const [repeatNewPassword, setRepeatNewPassword] = React.useState("");

    /**
     * Runs when page loads in and the userId is filled in. will run again when editmode has been changed.
     */
    useEffect(() => {
        initialize(editMode)
    },);

    /**
     * Method used for loading/reloading the userinformation
     * @param edit which indicates if the profile will be editable or notm this boolean also sets the editmode parameter.
     */
    const initialize = async (edit: boolean) => {
        await setProfileId(useParams);
        await setCurrentlyLoggedInUser(props.auth.User);
        await setEditMode(edit);
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
        await UpdateUserInformation(user);
        if(changePassword && oldPassword !== "" && newPassword !== ""&& repeatNewPassword !== ""){
            await ChangePassword(user.Id,oldPassword, newPassword);
        }
        else{
            //ignore
        }
        await initialize(false);
    };


    const onEmailChange = (event: any) => {
        user.Email = event.target.value;
    };

    const onIsDelegateChange = (event: any) => {
        user.isDelegate = event.target.value;
    };

    const onDAPPOwnerChange = (event: any) => {
        user.isdAppOwner = event.target.value;
    };

    const onChangeOldPassword = (event: any) =>{
        setOldPassword(event.target.value);
    };

    const onChangeNewPassword = (event: any) =>{
        setNewPassword(event.target.value);
    };

    const onChangeNewRepeatPassword = (event: any) =>{
        setRepeatNewPassword(event.target.value);
    };

    //Method that is used for changing the edit passwordblock
    const setChangePasswordBlock = (event : any) =>{
        setChangePassword(event.target.value);
        if(event.target.value){
            setPasswordBlock(editPasswordBlock);
        }
        else{
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
                    <Form.Control type="password" placeholder="repeat new password" onChange={onChangeNewRepeatPassword}/>
                </Form.Group>
            </Form>
        )
    };

    /**
     * Html Block that is used when just viewing a profile.
     * @param user which contains display information.
     */
    const profileInformationBlockNotEdit = (user: User) =>{
        return (
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
        )
    };

    /**
     * Html Block that is used when editing a profile.
     */
    const profileInformationBlockEditMode = () =>{
        return(
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
        //profile block that is variable to edit and non edit mode.
        if (!edit) {
            setProfileInformationBlock(
                profileInformationBlockNotEdit(user)
            );
        } else {
            setProfileInformationBlock(
                profileInformationBlockEditMode
            );
        }

        //Button that you can use if you are logged to start and save edit.
        if (loggedIn && !edit) {
            setEditButton(<Button onClick={() => {
                initialize(true)
            }}>Edit</Button>);
        } else if (edit && loggedIn) {
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
    /**
     * Url is now local
     */
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
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + "/" + user.Id, options);
        return response.status === 200;
    } catch (Exception) {
        console.log("EXCEPTION WHEN UPDATING USER: " + JSON.stringify(user) + " Exception: " + Exception)
        return false;
    }
}

export async function ChangePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>{
        let passwordModel : ChangePasswordModel = {
            OldPassword : oldPassword,
            NewPassword : newPassword
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

    try{
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL+"/"+userId,options);
        return response.status === 200;
    }
    catch (e) {
        console.log("CHANGEPASSWORD EXPECTION: " + e);
        return false;
    }


}

