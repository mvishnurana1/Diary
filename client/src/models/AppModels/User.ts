import { DiaryEntry } from "./DiaryEntry";

interface User {
    userID: string,
    userName: string,
    email:string,
    entries: DiaryEntry[];
}

export { type User };
