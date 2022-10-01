import { LoggedInUser } from "../../models/LoggedInUser";
import { BASE_URL } from "../url";

export async function fetchUser(): Promise<LoggedInUser> {

    const defaultUser: LoggedInUser = {
        email: undefined!,
        userID: undefined!,
        userName: undefined!
    }

    const accessToken = window.localStorage.getItem("accessToken");
    const headers: HeadersInit = {};

    if (accessToken) {
        headers.Authorization = `bearer ${accessToken}`;
    }

    const ID_TOKEN = window.localStorage.getItem("idToken");
    
    if (accessToken && ID_TOKEN) {
        const response = await fetch(`${BASE_URL}user?token=${ID_TOKEN}`, { headers });
        const responseUser = await await response.json() as Promise<LoggedInUser>;
        const loggedInPerson = await responseUser;
        return loggedInPerson;
    }

    return Promise.resolve(defaultUser);
}
