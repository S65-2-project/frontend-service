import {User} from "./CreateDelegateOfferModel";

export interface UpdateDelegateOfferModel {
    Title: string,
    Description: string,
    LiskPerMonth: number,
    AvailableForInMonths : number,
    Region: string,
    Provider: User
}

export const initDelegateUpdateOffer : UpdateDelegateOfferModel = {
    Provider : {Id: "", Email:""},
    Title: "",
    Description: "",
    LiskPerMonth: 1,
    Region: "Global",
    AvailableForInMonths: 1
};