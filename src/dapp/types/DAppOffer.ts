

export interface User {
    id : string,
    name : string
}

export interface DAppOffer{
    id : string,
    provider : User,
    description : string,
    offerLengthInMonths : number,
    liskPerMonth: number,
    delegatesNeededForOffer : number,
    delegatesCurrentlyInOffer: User[],
    dateStart : any,
    dateEnd: any,
    region : string
}
