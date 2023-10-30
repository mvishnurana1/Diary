import { GetToken } from "../../../helper";
import { DiaryEntry } from "../../../models/DiaryEntry";
import { SearchViaContentRequestDto } from "../../../models/SearchViaContentRequestDto";
import { BASE_URL } from "../../url";

export async function fetchSearchedEntryByContent(request: SearchViaContentRequestDto): Promise<DiaryEntry[]> {
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
        await fetch(`${BASE_URL}searchbycontent/?content=${request.content}&&userID=${request.userID}`, 
        { headers });

        const x = await response.json() as Promise<DiaryEntry[]>;
        const searchResult = await x;

        return searchResult;
    }

    return Promise.resolve([defaultEntry]);
}
