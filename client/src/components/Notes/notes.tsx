import { useAuth0 } from '@auth0/auth0-react';
import { faFaceSadCry, 
    faMagnifyingGlass, 
    faXmark,
    faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { SearchResults } from '../SearchResults/SearchResults';
import { dateFormat } from '../../helper/date-fn';
import { DiaryEntry } from '../../models/DiaryEntry';
import { LoggedInUser } from '../../models/LoggedInUser';
import { fetchUser } from '../../utils/api/fetchUser';
import { fetchEntryByDate } from '../../utils/api/fetchEntryByDate';
import { postNewNotes } from '../../utils/api/postNewNotes';
import { fetchSearchedEntryByContent } from '../../utils/api/fetchSearchedEntryByContent';
import { fetchDatesofNotesForLoggedInUser } from '../../utils/api/fetchDatesofNotesForLoggedInUser.';
import { activeOnMobileDisplay } from '../../models/activeOnMobileDisplay';
import { Header } from '../common/Header/Header';
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

const defaultUser: LoggedInUser = {
    email: undefined!,
    userID: undefined!,
    userName: undefined!
}

export function Notes(): JSX.Element {
    const [content, setContent] = useState('');
    const [displaySearch, setDisplaySearch] = useState(false);
    const [error,  setError] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [searchedResult, setSearchedResult] = useState<DiaryEntry[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>(defaultUser);
    const [validNoteDates, setValidNoteDates] = useState<Date[]>([]);
    const [recentlyPosted, setRecentlyPosted] = useState(false);
    const [active, setActive] = useState<activeOnMobileDisplay>(activeOnMobileDisplay.search);

    const {
        getAccessTokenSilently,
        isAuthenticated,
        loginWithRedirect,
        user,
        getIdTokenClaims,
        logout
    } = useAuth0();

    useEffect(() => {
        (async () => {
            try {
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
        })();
    });

    useEffect(() => {
        (async () => {
            try {
                const user = await fetchUser();
                setLoggedInUser(user);
            } catch (err) {
                setError(true);
            } 
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let id = undefined;

                if (loggedInUser.userID === undefined) {
                    const user = await fetchUser();
                    id = user.userID;
                    setLoggedInUser(user);
                }

                if (id !== undefined) {
                    const x = await fetchDatesofNotesForLoggedInUser(id);

                    const dates = x?.map(date => new Date(date));
                    setValidNoteDates(dates!);
                }
                
            } catch (err) {
                console.error('Could not fetch dates');
            }
        })();
    }, [loggedInUser]);

    useEffect(() => {
        (async () => {
            try {
                const x = await fetchDatesofNotesForLoggedInUser(loggedInUser.userID);
                const dates = x?.map(date => new Date(date));
                setValidNoteDates(dates!);
            } catch (err) {
                console.error('Could not fetch dates');
            }
        })();
    }, [recentlyPosted, loggedInUser.userID]);

    async function fetchDiaryEntryContentByDate(date: Date) {
        try {
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
        }
    }

    async function postNote() {
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        } else {
            try 
            {
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
                setRecentlyPosted(true);
            }
        }
    }

    async function getSearchedEntryByContent() {
        setDisplaySearch(!displaySearch);
        if (searchedContent === null || searchedContent.match(/^ *$/) !== null) {
            return;
        } else {
            try {
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
            return (
            <div className="entry-card-container">
                        <div>
                            <SearchResults
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
            )
        }
    }

    return (
        <div className='notes-landing-page'>
                { user && isAuthenticated &&
                    <div className='mobile'>
                        <Header 
                            user={user}
                            logout={logout}
                        />
                    </div>
                }

            <div className='notes'>
                <>
                    {displayError()}
                </>

                {validNoteDates && !searchedResult.length ? <div className='left'>
                                                    <div className={error ? 'no-display': 'datepicker'}>
                                                        <DatePicker
                                                            highlightDates={validNoteDates}
                                                            inline
                                                            maxDate={new Date()}
                                                            onChange={(date: Date) => {
                                                                fetchDiaryEntryContentByDate(date);
                                                                setStartDate(new Date(date));
                                                            }}
                                                            selected={startDate}
                                                            title="date-picker"
                                                        />
                                                    </div>
                                            </div> : null
                }
                
                <div className={ searchedResult.length > 0 ? 'no-display' : 'vertical-rule' }></div>

                <div className='column'>
                    { isAuthenticated && user &&
                        <div className='desktop'>
                            <Header 
                                user={user}
                                logout={logout}
                            />
                        </div>
                    }

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

                    <div className={searchedResult?.length > 0 || error ? 'no-display' : 'centre'}>
                        <textarea
                            className={ error ? 'no-display': 'textArea' }
                            rows={15}
                            placeholder="Dear Diary..."
                            onChange={(e) => setContent(e.target.value)}
                            spellCheck={false}
                            value={content}
                        />
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
                        <div className="centre">
                            <button
                                className={ searchedResult.length > 0 || error ? 'no-display' : 'save button' }
                                onClick={() => {
                                    postNote();
                                    setContent('')
                                }}
                                title={ content?.length === 0 ? 'Write note' : 'SAVE' }
                                disabled={ content?.length === 0 }>
                                { content?.length === 0 ? 'Write note' : 'SAVE' }
                            </button>
                        </div>
                    {displayCard()}
                </div>
        </div>
        
        <div className='mobile'>
            <div className='fab-container'>
                <button className='button iconbutton centre' onClick={() => 
                        active === activeOnMobileDisplay.calendar 
                        ? setActive(activeOnMobileDisplay.search)
                        : setActive(activeOnMobileDisplay.calendar)
                    }>
                    <FontAwesomeIcon
                        color='white'
                        icon={faCalendar}
                        size="2x"
                    />
                </button>
            </div>
        </div>
    </div>
    )
}
