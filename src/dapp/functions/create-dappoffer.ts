import config from "../../config.json";
import {CreateDAppOfferModel} from "../types/CreateDAppOfferModel";
import {DAppOffer} from "../types/DAppOffer";

export async function createDappOffer(model : CreateDAppOfferModel) : Promise<DAppOffer>{
    let options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    };
    let response = await fetch(config.SERVICES.DAPP, options);

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