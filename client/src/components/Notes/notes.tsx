import { useAuth0 } from '@auth0/auth0-react';
import { faFaceSadCry, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import ClipLoader from "react-spinners/ClipLoader";
import { EntryCard } from '../SearchResults/SearchResults';
import { dateFormat } from '../../helper/date-fn';
import { DiaryEntry } from '../../models/DiaryEntry';
import { LoggedInUser } from '../../models/LoggedInUser';
import { fetchUser } from '../../utils/api/fetchUser';
import { fetchEntryByDate } from '../../utils/api/fetchEntryByDate';
import { postNewNotes } from '../../utils/api/postNewNotes';
import { fetchSearchedEntryByContent } from '../../utils/api/fetchSearchedEntryByContent';
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

export function Notes(): JSX.Element {
    const defaultUser: LoggedInUser = {
        email: undefined!,
        userID: undefined!,
        userName: undefined!
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
            try {
                setLoading(true);

                const user = await fetchUser();
                setLoggedInUser(user);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function fetchDiaryEntryContentByDate(date: Date) {
        try {
            setLoading(true);
            let id = undefined;

            if (loggedInUser.userID === undefined) {
                const user = await fetchUser();
                id = user.userID;
                setLoggedInUser(user);
            }

            const content = await fetchEntryByDate(
                { formattedDate: dateFormat(date), loggedInUserID: loggedInUser.userID ?? id }
            );

            setContent(content);
            return content;
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    async function postNote() {
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        } else {
            try 
            {
                setLoading(true);

                let id = undefined;

                if (loggedInUser.userID  === undefined) {
                    const user = await fetchUser();
                    id = user.userID;
                    setLoggedInUser(user);
                }

                const diaryEntry = await postNewNotes(
                {
                    UserID: loggedInUser.userID ?? id,
                    Content: content,
                    SubmittedDateTime: dateFormat(startDate)
                });

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
        if (searchedContent === null || searchedContent.match(/^ *$/) !== null) {
            return;
        } else {
            try {
                setLoading(true);

                let id = undefined;

                if (loggedInUser.userID  === undefined) {
                    const user = await fetchUser();
                    id = user.userID;
                    setLoggedInUser(user);
                }

                const searchResult = await fetchSearchedEntryByContent
                ({ userID: loggedInUser.userID ?? id, content: searchedContent });

                setSearchedResult(searchResult);
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
                    onClick={() => getSearchedEntryByContent()}
                    size="lg"
                />
            </div>

            <div className={searchedResult?.length > 0 || error ? 'no-display' : 'notes-layout'}>
                {!loading ? <div className='left'>
                                <DatePicker
                                    className={error ? 'no-display': 'input' }
                                    title="date-picker"
                                    selected={startDate}
                                    onChange={(date: Date) => {
                                        fetchDiaryEntryContentByDate(date);
                                        setStartDate(new Date(date));
                                        setLoading(true);
                                    }}
                                    maxDate={new Date()}
                                />
                            </div> : null
                }

                {loading ? <div className="centre">
                                <ClipLoader
                                    color='red'
                                    data-testid="clip-loader"
                                    size={150}
                                />
                            </div>
                         : <textarea
                                className={ error ? 'no-display': 'textArea' }
                                rows={15}
                                placeholder="Dear Diary..."
                                onChange={(e) => setContent(e.target.value)}
                                spellCheck={false}
                                value={content}
                            />}
            </div>

            {error ?   <div
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
                className={ searchedResult.length > 0 || error || loading ? 'no-display' : 'save button' }
                onClick={() => {
                    postNote();
                    setLoading(true);
                    setContent('')
                }}
                disabled={ content?.length === 0 }>
                { content?.length === 0 ? 'Write note' : 'SAVE' }
            </button>
            {displayCard()}
        </div>
    )
}
