import config from "../../config.json";
import {DAppResponses} from "../types/DAppResponses";
export async function GetDAppOffer (id:any) : Promise<DAppResponses>{
    let options: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    let response = await fetch(config.SERVICES.DApp+"/"+id, options);

    let body = await response.text();

    if(response.status === 200){//success
        return JSON.parse(body);
    }
    else if(response.status >= 400){//error
        throw new Error(body);
    }
    else{//strange things happend.
        throw new Error("Unknown error occurred");
    }
}