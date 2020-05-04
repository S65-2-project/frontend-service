import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import User, {initialUserState} from "./types/user";
import config from "../config.json"



const Profile = (props: any) => {
    const [userId, setUserId] = React.useState();
    /**
     * user : User which is initialized with the initialUserState
     * initialUserState has empty strings, and state false on isDelegate and isdAppOwner
     */
    const [user, setUser] = React.useState(initialUserState);
    setUserId(useParams);

    /**
     * Runs when page loads in and the userId is filled in.
     */
    useEffect(() => {initialize(userId)},[userId]);

    /**
     * Method used for loading the userinformation
     * @param userId the Id of the user that will be loaded in through an api get call.
     */
    const initialize = async (userId : any) =>{
         //userid == authreducer
    }

};

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
    let response : Response = await fetch(config.SERVICES.ACCOUNT_SERVICE_URL + "")
    return initialUserState;

}

export default Profile