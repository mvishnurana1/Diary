import { dateFormat } from '../../helper/date-fn';
import { GetToken } from '../../helper/getToken';
import { IAddMonthPriorityRequestModel, IMonthPriorityResponseModel, IRemoveMonthPriorityRequestModel } from '../../models/MonthPriority';
import { BASE_URL } from '../url';

export async function addAnotherPriorityForMonth(priority: IAddMonthPriorityRequestModel): Promise<IMonthPriorityResponseModel | null> {
    // Check everything exists on the priority model
    // check if the userID exists
    // has a date in the right format 
    // the content is not the same as something existing
    const { userID, content } = priority;

    if (userID.length === 0 || content.length === 0) {
        return null;
    }

    const token = GetToken();
    const formattedDate = dateFormat(new Date());

    const response = await fetch(`${BASE_URL}addpriorities?month=${formattedDate}&userID=${priority.userID}&priorityContent=${priority.content}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json() as Promise<IMonthPriorityResponseModel>;
}

export async function removeAnotherPriorityForMonth(priority: IRemoveMonthPriorityRequestModel) {
    const { id, userID } = priority;
    const token = GetToken();

    const response = await fetch(`${BASE_URL}removepriority?id=${id}&userID=${userID}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json() as Promise<IMonthPriorityResponseModel[]>;
}

export async function fetchPriorityForMonth(userID: string) {
    const token = GetToken();

    const response = await fetch(`${BASE_URL}priorities?userID=${userID}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json() as Promise<IMonthPriorityResponseModel[]>;
}
