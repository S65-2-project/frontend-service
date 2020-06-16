import {User} from "./CreateDAppOfferModel";

export interface DAppOffer{
    id: string
    provider: User
    title: string
    description: string
    offerLengthInMonths: number
    liskPerMonth: number
    delegatesNeededForOffer: number
    delegatesCurrentlyInOffer : User[]
    region : string
    dateStart : string
    dateEnd : string
}
