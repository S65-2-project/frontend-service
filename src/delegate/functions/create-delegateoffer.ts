import {CreateDelegateOfferModel} from "../types/CreateDelegateOfferModel";
import {DelegateOffer} from "../types/DelegateOffer";
import config from "../../config.json";

export async function createDelegateOffer(model : CreateDelegateOfferModel, token : string) : Promise<DelegateOffer>{
    console.log(token);
    let options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " +token
        },
        body: JSON.stringify(model)
    };
    let response = await fetch(config.SERVICES.DELEGATE, options);

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