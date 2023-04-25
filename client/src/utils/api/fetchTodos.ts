import { Todos } from "../../models/Priority";
import { BASE_URL } from "../url";

export async function fetchTodos(): Promise<Todos> {

    const defaultUser: Todos = {
        content: undefined!,
        id: undefined!,
    }

    const accessToken = window.localStorage.getItem("accessToken");
    const headers: HeadersInit = {};

    if (accessToken) {
        headers.Authorization = `bearer ${accessToken}`;
    }

    const ID_TOKEN = window.localStorage.getItem("idToken");

    if (accessToken && ID_TOKEN) {
        const response = await fetch(`${BASE_URL}user?token=${ID_TOKEN}`, { headers });
        const responseUser = await await response.json() as Promise<Todos>;
        const loggedInPerson = await responseUser;
        return loggedInPerson;
    }

    return Promise.resolve(defaultUser);
}
