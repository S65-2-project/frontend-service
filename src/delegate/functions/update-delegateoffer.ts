import config from "../../config.json";
import {UpdateDelegateOfferModel} from "../types/UpdateDelegateOfferModel";

export async function UpdateDelegateOffer(id: any, model: UpdateDelegateOfferModel, token : string){
    let options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " +token
        },
        body: JSON.stringify(model)
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
};