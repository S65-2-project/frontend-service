import {User} from "./CreateDAppOfferModel";

export interface UpdateDAppOfferModel{
//     [Required] public string Title { get; set; }
// [Required] public string Description { get; set; }
// [Required] public int OfferLengthInMonths { get; set; }
// [Required] public int LiskPerMonth { get; set; }
// [Required] public int DelegatesNeededForOffer { get; set; }
// [Required] public string Region { get; set; }
// [Required] public DateTime DateStart { get; set; }
// [Required] public DateTime DateEnd { get; set; }
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