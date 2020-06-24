export interface User {
    id: string,
    Email: string
}

export interface CreateDAppOfferModel {
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

export const initDAppCreateOffer : CreateDAppOfferModel ={
    Title: "",
    Provider: {id: "", Email: ""},
    Description: "",
    OfferLengthInMonths : 10,
    LiskPerMonth : 1,
    DelegatesNeededForOffer : 5,
    Region: "Global",
    DateStart : "",
    DateEnd: ""
};