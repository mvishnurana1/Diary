import { createContext } from "react";

export const NotesContext = createContext({
    validNoteDates: Array<Date>(),
    setValidNoteDates: (dates: Array<Date>) => {}    
});
