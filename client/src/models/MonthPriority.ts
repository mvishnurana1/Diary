export interface IAddMonthPriorityRequestModel {
    userID: string,
    content: string
}

export interface IRemoveMonthPriorityRequestModel {
    id: string,
    userID: string
}

export interface IMonthPriorityResponseModel {
    id: string,
    date: string,
    priorityContent: string
}

export interface IPriorityModel {
    id: string,
    content: string,
    date: Date
}
