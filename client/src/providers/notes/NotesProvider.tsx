import { ReactNode, useState } from "react"
import { DiaryEntry } from "../../models/DiaryEntry"
import { GetToken } from "../../helper/getToken";
import { dateFormat } from "../../helper/date-fn";
import { postNewDiaryEntryModel } from "../../models/PostNewDiaryEntryModel";
import { FetchEntriesByDateModel } from "../../models/FetchEntriesByDateModel";
import { BASE_URL, KESTRAL_URL } from '../api';
import { DiaryEntryContext } from "./NotesContext";

interface Props {
    children?: ReactNode
}

export const NotesProvider = ({ children, ...props }: Props) => {
    const [content, setContent] = useState<string>('');
    const [error,  setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [searchedResult, setSearchedResult] = useState<DiaryEntry[]>([]);
    const [displaySearch, setDisplaySearch] = useState(false);

    async function fetchDiaryEntryContentByDate(request: FetchEntriesByDateModel) {
        
        const token = GetToken();

        try {
            const headers: HeadersInit = {};

            if (token) {
                headers.Authorization = `bearer ${token}`;
            }

            const response = await fetch(`${BASE_URL}get/?date=${request.formattedDate}&&userID=${request.loggedInUserID}`, { headers });
            const content = await response.text();

            setContent(content);

            return content;
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    async function getSearchedEntryByContent() {
        setDisplaySearch(!displaySearch);
        const token = GetToken();

        if (searchedContent === null || searchedContent.match(/^ *$/) !== null || token === null) {
            return;
        } else {
            setLoading(true);

            const headers: HeadersInit = {};

            if (token) {
                headers.Authorization = `bearer ${token}`;
            }

            try {
                const response = await fetch(`${BASE_URL}searchbycontent/?content=${searchedContent}`, { headers });

                const x = await response.json() as Promise<DiaryEntry[]>;
                const searchResult = await x;

                setSearchedResult(searchResult);

                return searchResult;
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    }

    async function postNewNotes() {
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        } else {
            setLoading(true);
            const token = GetToken();
            const formattedDate =  dateFormat(startDate);

            // WIP: Simulating logged-in user's ID (database)
            const loggedInUserID = '0da0fce4-a693-4bb3-b1bb-69f1db0263a7';

            const postEntry: postNewDiaryEntryModel = {
                UserID: loggedInUserID,
                Content: content,
                SubmittedDateTime: formattedDate
            }

            try {
                const response = await fetch(`${BASE_URL}post/`, {
                    method: 'POST',
                    body: JSON.stringify(postEntry),
                    headers: {
                        'Authorization': `bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json() as Promise<DiaryEntry>; 
                const diaryEntry = await result;
                setContent(diaryEntry.content);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    }

    return <DiaryEntryContext.Provider 
    value={{
                content: [content, setContent], 
                error: [error,  setError],
                searchedContent: [searchedContent, setSearchedContent],
                loading: [loading, setLoading],
                startDate: [startDate, setStartDate],
                searchResult: [searchedResult, setSearchedResult],
                fetchDiaryEntryContentByDate,
                postNewNotes,
                getSearchedEntryByContent
        }}>
        {children}
    </DiaryEntryContext.Provider>
};
