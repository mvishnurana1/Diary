import { createContext } from "react";

const NotesContext = createContext({
    consent: String,
    names: Array<string>,
    setNames: (name: string) => {},
    setConsent: (val: string) => {}
});

export default NotesContext;
