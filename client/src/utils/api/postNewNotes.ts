import { GetToken } from "../../helper/getToken";
import { DiaryEntry, postNewDiaryEntryModel } from "../../models";
import { BASE_URL } from "../url";

export async function postNewNotes(newNote: postNewDiaryEntryModel): Promise<DiaryEntry> {
    const token = GetToken();

    const response = await fetch(`${BASE_URL}post/`, {
        method: 'POST',
        body: JSON.stringify(newNote),
        headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json() as Promise<DiaryEntry>;
}
