import { createContext } from "react";
import { DiaryEntry } from "../../models";

const NotesContext = createContext({
    content: '', setContent: (val: string) => {},
    startDate: new Date(), setStartDate: (date: Date) => {},
    error: false, setError: (errorVal: boolean) => {},
    recentlyPosted: false, setRecentlyPosted: (val: boolean) => {},
    searchedResult: [], setSearchedResult: (entries: DiaryEntry[]) => {},
    validNoteDates: [], setValidNoteDates: (newDates: Array<Date>) => {}
});

export default NotesContext;
