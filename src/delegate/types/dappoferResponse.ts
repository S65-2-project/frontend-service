export interface DappoferResponse {
    id: string,
    provider: {id: string, name: string},
    title: string,
    description: string,
    region : string,
    liskPerMonth: number,
    availableForInMonths: number
}