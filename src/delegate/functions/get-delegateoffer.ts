import config from "../../config.json";
import {DappoferResponse} from "../types/dappoferResponse";

export async function GetDelegateoffer (id : any) : Promise<DappoferResponse> {
    let options: RequestInit = {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    let response = await fetch(config.SERVICES.DELEGATE+"/"+id, options);

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