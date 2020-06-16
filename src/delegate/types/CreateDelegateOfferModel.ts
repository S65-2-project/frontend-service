export interface User{
    Id: string,
    Email: string
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
    Provider : {Id: "", Email:""},
    Title: "",
    Description: "",
    LiskPerMonth: 1,
    Region: "Global",
    AvailableForInMonths: 1
};