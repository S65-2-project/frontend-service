import {User} from "./CreateDelegateOfferModel";

export interface DelegateOffer{
    Id: string,
    Provider: User,
    Title: string,
    Description: string,
    Region : string,
    LiskPerMonth: number,
    AvailableForInMonths: number
}