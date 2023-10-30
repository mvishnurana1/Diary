import { GetToken } from "../../../helper";
import { DiaryEntry } from "../../../models/AppModels/DiaryEntry";
import { postNewDiaryEntryModel } from "../../../models/AppModels/PostNewDiaryEntryModel";
import { BASE_URL } from "../../url";

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
