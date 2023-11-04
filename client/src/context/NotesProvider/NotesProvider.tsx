import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AuthProvider/AuthContext";
import { NotesContext } from "./NotesContext";
import { fetchDatesOfNotesForLoggedInUser } from '../../utils/api';

type Props = {
    children: string | JSX.Element | JSX.Element[]
}

export function NotesProvider({children}: Props) {
    const [validNoteDates, setValidNoteDates] = useState<Date[]>([]);
    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedInUser) return;

        fetchDatesOfNotesForLoggedInUser(loggedInUser.userID).then(dates => {
            if (!dates) return;
            const x = dates?.map(k => new Date(k))
            setValidNoteDates([...x!]);
        })
    }, [loggedInUser]);

    return (<NotesContext.Provider value={{
        setValidNoteDates: setValidNoteDates,
        validNoteDates: validNoteDates
    }}>
        {children}
    </NotesContext.Provider>)
}
