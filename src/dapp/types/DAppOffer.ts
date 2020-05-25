

export interface User {
    id : string,
    name : string
}

export interface DAppOffer{
    id : string,
    provider : User,
    description : string,
    lengthOfOfferInMonths : number,
    liskPerMonth: number,
    delegatesNeededForOffer : number,
    delegatesCurrentlyInOffer: User[],
    dateStart : string,
    dateEnd: string,
    region : string
}
