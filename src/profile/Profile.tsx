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
    const [currentlyLoggedInUser, setCurrentlyLoggedInUser] = React.useState(initialUserState)
    const [userId, setUserId] = React.useState();
    /**
     * user : User which is initialized with the initialUserState
     * initialUserState has empty strings, and state false on isDelegate and isdAppOwner
     */
    const [user, setUser] = React.useState(initialUserState);
    //TODO: Change loading to a nice spinner prio:LOW
    const [profileInformationBlock, setProfileInformationBlock] = React.useState(<div>loading...</div>);
    const [editButton, setEditButton] = React.useState(<div/>)

    setUserId(useParams);
    /**
     * Runs when page loads in and the userId is filled in.
     */
    useEffect(() => {initialize(userId)},[userId]);

    /**
     * Method used for loading the userinformation
     * @param userId the Id of the user that will be loaded in through an api get call.
     */
    const initialize = async (userId : string) =>{
        await setCurrentlyLoggedInUser(props.auth.User);
        if(props.auth.User.Id === userId){
            setInformationDisplay(currentlyLoggedInUser, true, false);
        }
        else{
            await setUser(await GetUserInformation(userId));
            setInformationDisplay(user, false, false);
        }
    };

    /**
     * Changes the display of the render to match the userinformation.
     * @param user which contains the information
     * @param loggedIn indicates if the information display should contain an edit button.
     */
    const setInformationDisplay = (user: User, loggedIn : boolean, editMode : boolean) =>{
        //TODO make display info nice.
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
        if(loggedIn){
            setEditButton(<Button>Edit</Button>);
        }
        else{
            setEditButton(<div/>)
        }
    };

    return(
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
const mapStateToProps = (state : authenticationState) => {
    return {
        auth: state
    };
};

export default withRouter(connect(mapStateToProps)(Login));

export async function GetUserInformation(userId : string) : Promise<User>{

    let options : RequestInit = {
        method: "Get",
        headers: {
            "Content-Type" : "application/json"
        },
        mode: "cors",
        cache: "default"
    };
    /**
     * Url is now local TODO: change this when backend gets updated
     */
    try {
        let response: Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + "");
        let body = await response.text();
        if (response.status === 200) {
            return JSON.parse(body); //returns type User if backend is consistent.
        } else {
            return initialUserState;
        }
    }catch(Exception){
        console.log("PROFILE GET REQUEST EXCEPTION: " + Exception);
        return initialUserState;
    }
}

