import { useAuth0 } from '@auth0/auth0-react';
import { faFaceSadCry, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import ClipLoader from "react-spinners/ClipLoader";
import { EntryCard } from '../EntryCard/entry-card';
import { dateFormat } from '../../helper/date-fn';
import { DiaryEntry } from '../../models/DiaryEntry';
import { FetchEntriesByDateModel } from '../../models/FetchEntriesByDateModel';
import { GetToken } from '../../helper/getToken';
import { postNewDiaryEntryModel } from '../../models/PostNewDiaryEntryModel';
import { LoggedInUser } from '../../models/LoggedInUser';
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

export function Notes(): JSX.Element {
    const BASE_URL = 'https://localhost:44315/';
    // const BASE_URL = 'https://localhost:5001/';

    const defaultUser: LoggedInUser = {
        email: '',
        userID: '',
        userName: ''
    }

    const [content, setContent] = useState('');
    const [displaySearch, setDisplaySearch] = useState(false);
    const [error,  setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [searchedResult, setSearchedResult] = useState<DiaryEntry[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>(defaultUser);

    const {
        getAccessTokenSilently, 
        isAuthenticated,
        loginWithRedirect,
        user,
        getIdTokenClaims
    } = useAuth0();
     
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const accessToken = await getAccessTokenSilently();
                const idToken = await getIdTokenClaims();
                console.log(idToken?.__raw);

                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem("email", idToken?.email!);
                window.localStorage.setItem('idToken', idToken?.__raw!);
                window.localStorage.setItem('photo', user?.picture!);
            }
            catch(err: any) {
                if (!isAuthenticated && (err.error === 'login_required' || err.error === 'consent_required')) {
                    loginWithRedirect();
                }
            }
            finally {
                setLoading(false);
            }
        })();
    });

    useEffect(() => {
        (async () => {
            const accessToken = window.localStorage.getItem("accessToken");
            const headers: HeadersInit = {};

            if (accessToken) {
                headers.Authorization = `bearer ${accessToken}`;
            }

            const ID_TOKEN = window.localStorage.getItem("idToken");
            
            if (accessToken && ID_TOKEN) {
                const response = await fetch(`${BASE_URL}user?token=${ID_TOKEN}`, { headers });
                const responseUser = await await response.json() as Promise<LoggedInUser>;
                const loggedInPerson = await responseUser;
                setLoggedInUser(loggedInPerson);
            }
        })();
    }, []);

    function fetchEntriesByDate(date: Date): void {
        const formattedDate = dateFormat(date);

        const entryByDateRequest : FetchEntriesByDateModel = {
            formattedDate: formattedDate,
            loggedInUserID: loggedInUser?.userID
        }

        fetchDiaryEntryContentByDate(entryByDateRequest);
    }

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

    async function postNewNotes() {
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        } else {
            setLoading(true);
            const token = GetToken();
            const formattedDate =  dateFormat(startDate);

            const postEntry: postNewDiaryEntryModel = {
                UserID: loggedInUser?.userID,
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

    function displayError() {
        if (error) {
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }

    function displayCard() {
        if (searchedResult?.length > 0) {
            return <div className="entry-card-container">
                    <div>
                        <EntryCard 
                            entries={searchedResult} 
                            setContent={setContent} 
                            setSearchedContent={setSearchedContent}
                            setStartDate={setStartDate}
                            setSearchedResult={setSearchedResult} 
                        />
                    </div>
                    <div className="center">
                        <FontAwesomeIcon
                            className='red'
                            icon={faXmark}
                            onClick={() => {
                                setSearchedResult([]);
                                setSearchedContent('');
                            }}
                            size="lg"
                        />
                    </div>
                </div>
        }
    }

    return (
        <div className='notes-landing-page'>
            <>
                {displayError()}
            </>
            <div className='search-box-container'>
                <input
                    className='search'
                    placeholder='find submitted entries...'
                    value={searchedContent}
                    onChange={(e) => setSearchedContent(e.target.value)}
                />

                <FontAwesomeIcon
                    className='red'
                    icon={faMagnifyingGlass}
                    onClick={() => {
                        getSearchedEntryByContent();
                    }}
                    size="lg"
                />
            </div>

            <div className={searchedResult?.length > 0 || error ? 'no-display' : 'notes-layout'}>
                {
                    !loading 
                        ? <div className='left'>
                            <DatePicker
                                className={error ? 'no-display': 'input' }
                                title="date-picker"
                                selected={startDate}
                                onChange={(date: Date) => {
                                    fetchEntriesByDate(date);
                                    setStartDate(new Date(date));
                                    setLoading(true);
                                }}
                                maxDate={new Date()}
                            />
                        </div>
                        : null 
                }
            

                {
                    loading
                        ? <div className="centre"> 
                            <ClipLoader 
                                color='red' 
                                data-testid="clip-loader"
                                size={150} 
                            /> 
                            </div>
                        : <textarea
                            className={
                                error ? 'no-display': 'textArea' 
                            }
                            rows={15}
                            placeholder="Dear Diary..."
                            onChange={(e) => {
                                setContent(e.target.value);
                            }}
                            spellCheck={false}
                            value={content}
                        />
                }
            </div>

            {
                error
                    ?   <div 
                            className='error-container'
                            data-testid="error-emoji">
                            <FontAwesomeIcon 
                                icon={faFaceSadCry} 
                                size="3x" 
                            />
                            <h6>Something went wrong. Please try again later!</h6>
                        </div>
                    : null
            }

            <button
                className={
                    searchedResult.length > 0 || error || loading ? 'no-display' : 'save button'
                }
                onClick={() => {
                    postNewNotes();
                    setLoading(true);
                    setContent('')
                }}
                disabled={content?.length === 0}>
                {content?.length === 0 ? 'Write note' : 'SAVE'}
            </button>
            {displayCard()}
        </div>
    )
}
