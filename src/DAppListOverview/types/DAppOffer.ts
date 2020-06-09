export interface DAppOfferUser {
    id: string;
    name: string;
}

export interface PaginationHeader {
    TotalCount: number | undefined;
    PageSize: number | undefined;
    CurrentPage: number;
    TotalPages: number;
    HasNext: boolean | undefined;
    HasPrevious: boolean | undefined;
}

export interface RequestDAppOfferOptions {
    PageNumber: number;
    PageSize: number;
    MinReward: number | undefined;
    MaxReward: number | undefined;
    RegionQuery: string;
    SearchQuery: string
}

export interface DAppOffer {
    id: string;
    provider: DAppOfferUser;
    title: string;
    description: string;
    liskPerMonth: number;
    region: string;
    offerLengthInMonths: number;
    dateStart: string;
    dateEnd: string;
}