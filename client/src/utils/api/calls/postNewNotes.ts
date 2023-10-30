import { GetToken } from "../../../helper";
import { DiaryEntry, PostNewDiaryEntryModel } from "../../../models";
import { BASE_URL } from "../../url";

export async function postNewNotes(newNote: PostNewDiaryEntryModel): Promise<DiaryEntry> {
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
