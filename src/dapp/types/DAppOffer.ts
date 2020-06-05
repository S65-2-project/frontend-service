import {User} from "./CreateDAppOfferModel";

export interface DAppOffer{
    Id: string
    Provider: User
    Title: string
    Description: string
    OfferLengthInMonths: number
    LiskPerMonth: number
    DelegatesNeededForOffer: number
    DelegatesCurrentlyInOffer : User[]
    Region : string
    DateStart : string
    DateEnd : string
}
