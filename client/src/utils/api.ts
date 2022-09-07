import axios from "axios";
import { DiaryEntry } from '../models/DiaryEntry';
import { postNewDiaryEntryModel } from "../models/PostNewDiaryEntryModel";

// const BASE_URL = 'https://localhost:44315/';
const BASE_URL = 'https://localhost:5001/';

export const getDiaryEntryByDate = async (date: Date): Promise<DiaryEntry[]> => {
    const entries = await axios.get<DiaryEntry[]>(`${BASE_URL}get/?date=${date}`);
    return entries.data;
}

export const postNewEntry = async (newEntry: postNewDiaryEntryModel): Promise<DiaryEntry>  => {
    if(!isContentValid(newEntry.content)) {
        return Promise.reject();        
    }

    const postedEntry = await axios.post<DiaryEntry>(`${BASE_URL}post`, newEntry);
    return postedEntry.data;
}

export const searchDiaryEntriesByContent = async (content: string): Promise<DiaryEntry[]> => {
    if(!isContentValid(content)) {
        return Promise.reject();        
    }

    const searchResults = await axios.get<DiaryEntry[]>(`${BASE_URL}searchbycontent/?content=${content}`);
    return searchResults.data;
}

const isContentValid = (content: string): boolean => {
    if (content === null || content.match(/^ *$/) !== null) {
        return false;
    }

    return true;
}
