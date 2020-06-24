export interface User{
    id: string,
    email: string
}

export interface DAppResponses{
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