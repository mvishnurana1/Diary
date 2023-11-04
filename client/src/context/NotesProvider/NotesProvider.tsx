import { useContext, useEffect, useState } from 'react';
import Children from '../../models/Types/Children';
import { fetchDatesOfNotesForLoggedInUser, fetchEntryByDate, postNewNotes } from '../../utils/api';
import { dateFormat } from '../../helper';
import { AuthContext } from '../AuthProvider/AuthContext';
import { NotesContext } from './NotesContext';

export function NotesProvider({children}: Children) {
    const [validNoteDates, setValidNoteDates] = useState<Date[]>([]);
    const [content, setContent] = useState<string>('');
    const [startDate, setStartDate] = useState(new Date());

    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedInUser) return;

        fetchDatesOfNotesForLoggedInUser(loggedInUser.userID).then(dates => {
            if (!dates) return;
            const x = dates?.map(k => new Date(k))
            setValidNoteDates([...x!]);
        })
    }, [loggedInUser]);

    async function postNote() {
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        }
        try {
            const diaryEntry = await postNewNotes({ UserID: loggedInUser.userID, Content: content, SubmittedDateTime: dateFormat(startDate)});
            setContent(diaryEntry.content);

        } catch (err) {
            throw err;
        } finally {
            setValidNoteDates([...validNoteDates, startDate]);
            setContent('');
        }
    }

    async function fetchDiaryEntryContentByDate(date: Date) {
        try {
            setStartDate(new Date(date));
            const content = await fetchEntryByDate({ formattedDate: dateFormat(date), loggedInUserID: loggedInUser.userID });
            setContent(content);

            return content;
        } catch (error) {
            throw error;
        }
    }

    return (<NotesContext.Provider value={{
        content: content,
        setContent: setContent,
        startDate: startDate,
        setStartDate: setStartDate,
        validNoteDates: validNoteDates,
        setValidNoteDates: setValidNoteDates,
        postNote: postNote,
        fetchDiaryEntryContentByDate: fetchDiaryEntryContentByDate
    }}>
        {children}
    </NotesContext.Provider>)
}
