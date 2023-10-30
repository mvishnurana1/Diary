import { DiaryEntry } from "./DiaryEntry";

interface DiaryEntryResponse {
    userName: string,
    email: string,
    DiaryEntry: DiaryEntry
};

export { type DiaryEntryResponse };
