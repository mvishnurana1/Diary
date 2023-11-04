import { LoggedInUser } from "../../../models";
import { BASE_URL } from "../../url";

export async function fetchUser(accessToken: string, idToken: string): Promise<LoggedInUser> {
    const headers: HeadersInit = {};

    headers.Authorization = `bearer ${accessToken}`;
    
    const response = await fetch(`${BASE_URL}user?token=${idToken}`, { headers });
    const responseUser = await await response.json() as Promise<LoggedInUser>;
    const loggedInPerson = await responseUser;
    return loggedInPerson;
}
