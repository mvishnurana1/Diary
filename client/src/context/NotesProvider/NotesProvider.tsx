import { useContext, useEffect, useState } from 'react';
import { NotesContext } from './NotesContext';
import { AuthContext } from '../AuthProvider/AuthContext';
import Children from '../../models/Types/Children';
import { fetchDatesOfNotesForLoggedInUser } from '../../utils/api';

export function NotesProvider({children}: Children) {
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
