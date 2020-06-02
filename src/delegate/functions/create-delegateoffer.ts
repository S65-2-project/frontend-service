import {CreateDelegateOfferModel} from "../types/CreateDelegateOfferModel";
import {DelegateOffer} from "../types/DelegateOffer";
import config from "../../config.json";

export async function createDappOffer(model : CreateDelegateOfferModel) : Promise<DelegateOffer>{
    let options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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