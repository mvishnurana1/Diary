import { createContext } from "react";

export const NotesContext = createContext({
    validNoteDates: Array<Date>(),
    setValidNoteDates: (dates: Array<Date>) => {},
    content: '',
    setContent: (content: string) => {},
    postNote: () => {},
    startDate: new Date(),
    setStartDate: (date: Date) => {},
    fetchDiaryEntryContentByDate: (date: Date) => {}
});
