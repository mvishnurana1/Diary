import { DiaryEntry } from "./DiaryEntry";

export interface User {
    userID: string,
    userName: string,
    email:string,
    entries: DiaryEntry[];
}
