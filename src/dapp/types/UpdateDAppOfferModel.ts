import {User} from "./CreateDAppOfferModel";

export interface UpdateDAppOfferModel{
    Title: string
    Provider: User,
    Description: string,
    OfferLengthInMonths: number,
    LiskPerMonth: number,
    DelegatesNeededForOffer: number,
    Region: string,
    DateStart: string,
    DateEnd: string
}

export const initDAppUpdateOffer : UpdateDAppOfferModel ={
    Title: "",
    Provider: {Id: "", Name: ""},
    Description: "",
    OfferLengthInMonths : 10,
    LiskPerMonth : 1,
    DelegatesNeededForOffer : 5,
    Region: "Global",
    DateStart : "",
    DateEnd: ""
};