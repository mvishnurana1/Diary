export interface IAddMonthPriorityRequestModel {
    userID: string,
    content: string
}

export interface IRemoveMonthPriorityRequestModel {
    id: string,
    userID: string
}

export interface IMonthPriorityResponseModel {
    userID: string,
    date: string,
    content: string
}

export interface IPriorityModel {
    id: string,
    content: string,
    date: Date
}
