import { createContext } from "react";
import { DiaryEntry } from "../../models";

const defaultResults: DiaryEntry[] = [];
const datesWithNote: Array<Date> = [];

const NotesContext = createContext({
    content: '', setContent: (val: string) => {},
    startDate: new Date(), setStartDate: (date: Date) => {},
    error: false, setError: (errorVal: boolean) => {},
    recentlyPosted: false, setRecentlyPosted: (val: boolean) => {},
    searchedResult: defaultResults, setSearchedResult: (entries: DiaryEntry[]) => {},
    validNoteDates: datesWithNote, setValidNoteDates: (newDates: Array<Date>) => {}
});

export default NotesContext;
