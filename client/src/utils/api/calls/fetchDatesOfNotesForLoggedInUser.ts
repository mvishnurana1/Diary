import { GetToken } from "../../../helper";
import { BASE_URL } from "../../url";

export async function fetchDatesOfNotesForLoggedInUser(loggedInUserID: string) {
    if (!loggedInUserID) {
        return;
    }

    const token = GetToken();

    const response = await fetch(`${BASE_URL}getdates/?loggedInUserID=${loggedInUserID}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json() as Promise<Date[]>;
}
