import { useState } from "react";
import NotesContext from './NotesContext';

function NotesProvider({children}) {
    const [error, setError] = useState(false);
    const [validNoteDates, setValidNoteDates] = useState([]);
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [recentlyPosted, setRecentlyPosted] = useState(false);
    const [searchedResult, setSearchedResult] = useState([]);

    return (
        <NotesContext.Provider value={{
            content, setContent,
            startDate, setStartDate,
            error, setError,
            recentlyPosted, setRecentlyPosted,
            searchedResult, setSearchedResult,
            validNoteDates, setValidNoteDates,
        }}>
            {children}
        </NotesContext.Provider>
    )
}

export { NotesProvider };
