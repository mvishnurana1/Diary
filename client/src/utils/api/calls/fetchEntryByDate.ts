import { FetchEntriesByDateModel } from "../../../models";
import { BASE_URL } from '../../url';

export async function fetchEntryByDate(request: FetchEntriesByDateModel): Promise<string> {
    const accessToken = window.localStorage.getItem("accessToken");
    const headers: HeadersInit = {};

    if (accessToken) {
        headers.Authorization = `bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}get/?date=${request.formattedDate}&&userID=${request.loggedInUserID}`, { headers });
    const content = await response.text();

    return content;
}
