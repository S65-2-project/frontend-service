export interface User{
    Id: string,
    Name: string
}
export interface CreateDelegateOfferModel{
    Provider: User,
    Title: string,
    Description: string,
    LiskPerMonth: number,
    Region: string,
    AvailableForInMonths: number
}

export const initDelegateCreateOffer : CreateDelegateOfferModel = {
    Provider : {Id: "", Name:""},
    Title: "",
    Description: "",
    LiskPerMonth: 1,
    Region: "Global",
    AvailableForInMonths: 1
};