import { GetToken } from "../../helper/getToken";
import { DiaryEntry } from "../../models/DiaryEntry";
import { SearchViaContentRequestDto } from "../../models/SearchViaContentRequestDto";
import { BASE_URL } from "../url";

export async function fetchSearchedEntryByContent(postSearchRequestByContent: SearchViaContentRequestDto): Promise<DiaryEntry[]> {
    const defaultEntry: DiaryEntry = {
        content: undefined!,
        entryID: undefined!,
        submittedDateTime: new Date(),
        userID: undefined!
    }

    const token = GetToken();
    const headers: HeadersInit = {};

    if (token) {
        headers.Authorization = `bearer ${token}`;

        const response = 
        await fetch(`${BASE_URL}searchbycontent/?content=${postSearchRequestByContent.content}&&userID=${postSearchRequestByContent.userID}`, 
        { headers });

        const x = await response.json() as Promise<DiaryEntry[]>;
        const searchResult = await x;

        return searchResult;
    }

    return Promise.resolve([defaultEntry]);
}
