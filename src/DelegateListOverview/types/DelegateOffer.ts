export interface DelegateOfferUser {
    id: string;
    email: string;
}

export interface PaginationHeader {
    TotalCount: number | undefined;
    PageSize: number | undefined;
    CurrentPage: number;
    TotalPages: number;
    HasNext: boolean | undefined;
    HasPrevious: boolean | undefined;
}

export interface RequestDelegateOffersOptions {
    PageNumber: number;
    PageSize: number;
    MaxMonth: number | undefined;
    MinMonth: number | undefined;
    MinPrice: number | undefined;
    MaxPrice: number | undefined;
    RegionQuery: string;
    SearchQuery: string
}

export interface DelegateOffer {
    id: string;
    provider: DelegateOfferUser;
    title: string;
    description: string;
    liskPerMonth: number;
    region: string;
    availableForInMonths: number;
}