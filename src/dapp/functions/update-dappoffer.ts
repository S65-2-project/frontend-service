import {UpdateDAppOfferModel} from "../types/UpdateDAppOfferModel";
import config from "../../config.json";

export async function UpdateDAppOffer(id: any,model : UpdateDAppOfferModel) : Promise<UpdateDAppOfferModel>{
    let options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    };
    let response = await fetch(config.SERVICES.DAPP+"/"+id, options);

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