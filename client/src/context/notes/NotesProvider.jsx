import { createContext, useState } from "react";

const NotesContext = createContext({
    consent: '',
    names: [],
    setNames: (...params) => {},
    setConsent: (...params) => {}
});

function NotesProvider({children}) {
    // const [contentInTextBox, setContentInTextBox] = useState('');
    const [consent, setConsent] = useState("Yes");
    const [names, setNames] = useState([]);

    return (
        <NotesContext.Provider value={{
                names,
                consent,
                setNames,
                setConsent
            }}>
            {children}
        </NotesContext.Provider>
    )
}

export { NotesContext, NotesProvider };
