import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { faMagnifyingGlass, faXmark, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { SearchResults } from '../SearchResults/SearchResults';
import { dateFormat } from '../../helper/date-fn';
import NotesContext from '../../context/notes/NotesContext';
import { Header } from '../common/Header/Header';
import { fetchDatesOfNotesForLoggedInUser, fetchUser, postNewNotes, 
    fetchEntryByDate, fetchSearchedEntryByContent } from '../../utils/api';
import { LoggedInUser } from '../../models/LoggedInUser';
import { activeOnMobileDisplay } from '../../models/activeOnMobileDisplay';
import ErrorComponent from '../common/ErrorComponent/ErrorComponent';
import ToDos  from '../ToDos/todos';
import PerformanceChart from '../ActivityChart/ActivityChart';
// import { MonthGoal } from '../MonthGoal/monthGoal';
import './notes.scss';
import "react-datepicker/dist/react-datepicker.css";

const defaultUser: LoggedInUser = {
    email: undefined!,
    userID: undefined!,
    userName: undefined!
}

export function Notes(): JSX.Element {
    const [displaySearch, setDisplaySearch] = useState(false);
    const [searchedContent, setSearchedContent] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>(defaultUser);
    const [active, setActive] = useState<activeOnMobileDisplay>(activeOnMobileDisplay.search);

    const {
        getAccessTokenSilently, isAuthenticated, 
        loginWithRedirect, user, 
        getIdTokenClaims, logout 
    } = useAuth0();
    
    const {
        content, setContent,
        startDate, setStartDate,
        error, setError,
        recentlyPosted, setRecentlyPosted,
        searchedResult, setSearchedResult,
        validNoteDates, setValidNoteDates 
    } = useContext(NotesContext);

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
            catch (err: any) {
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
    }, [setError]);


    useEffect(() => {
        (async () => {
            try {
                let id = '';

                if (loggedInUser.userID === undefined) {
                    const user = await fetchUser();
                    id = user.userID;
                    setLoggedInUser(user);
                }

                if (id !== undefined) {
                    const x = await fetchDatesOfNotesForLoggedInUser(id);

                    const dates = x?.map(date => new Date(date));
                    setValidNoteDates(dates!);
                }

            } catch (err) {
                setError(true);
            }
        })();
    }, [recentlyPosted, loggedInUser, setValidNoteDates, setError]);

    async function postCachedActivity() {
        const active = JSON.parse(localStorage.getItem('active')!);

        if (!active?.content || !active?.startDate) {
            return;
        } else {
            try {
                let id = undefined;

                if (loggedInUser.userID === undefined) {
                    const user = await fetchUser();
                    id = user.userID;
                    setLoggedInUser(user);
                }

                const diaryEntry = await postNewNotes(
                    {
                        UserID: loggedInUser.userID ?? id,
                        Content: active?.content,
                        SubmittedDateTime: dateFormat(active?.startDate)
                    });

                setContent(diaryEntry.content);
            } catch (err) {

            } finally {
                setRecentlyPosted(true);
                localStorage.removeItem('active');
            }
        }
    }

    async function fetchDiaryEntryContentByDate(date: Date) {
        try {
            let id = '';

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
            try {
                let id = '';

                if (loggedInUser.userID === undefined) {
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
                let id = '';

                if (loggedInUser.userID === undefined) {
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

    function cacheActiveEntry(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const active = { startDate, content };
        localStorage.setItem('active', JSON.stringify(active));
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
            {user && isAuthenticated &&
                <div className='mobile' id='header'>
                    <Header user={user} logout={logout} />
                </div>
            }

            <div className='notes'>
                <>
                    {displayError()}
                </>

                {validNoteDates && !searchedResult.length &&
                    <div className='left'>
                        <div className={error ? 'hide' : 'datepicker'}>
                            <div className='mobile'>
                                {active === activeOnMobileDisplay.calendar &&
                                    <DatePicker 
                                        highlightDates={validNoteDates} 
                                        inline 
                                        maxDate={new Date()}
                                        onChange={(date: Date) => {
                                            postCachedActivity();
                                            fetchDiaryEntryContentByDate(date);
                                            setStartDate(new Date(date));
                                        }}
                                        selected={startDate}
                                        title="date-picker"
                                    />
                                }
                            </div>
                            <div className={error ? 'hide' : 'desktop datepicker'}>
                                <ToDos />
                                <h1 className='title'>Pick a Date</h1>
                                <h2 className='sub-title'>Write journal</h2>
                                <div className='centralise'>
                                    <DatePicker
                                        highlightDates={validNoteDates}
                                        inline
                                        maxDate={new Date()}
                                        onChange={(date: Date) => {
                                            postCachedActivity();
                                            fetchDiaryEntryContentByDate(date);
                                            setStartDate(new Date(date));
                                        }}
                                        selected={startDate}
                                        title="date-picker"
                                    />
                                </div>
                                {/* <hr />
                            <MonthGoal />  */}
                                <PerformanceChart />
                            </div>
                        </div>
                    </div>
                }

                <div className={searchedResult.length > 0 ? 'hide' : 'vertical-rule'}></div>

                <div className='column'>
                    {isAuthenticated && user &&
                        <div className='desktop'>
                            <Header user={user} logout={logout} />
                        </div>
                    }

                    <div className='mobile'>
                        {(active === activeOnMobileDisplay.search) && <div className='search-box-container'>
                            <input
                                className='search' placeholder='find submitted entries...'
                                value={searchedContent} onChange={(e) => setSearchedContent(e.target.value)} />

                            <FontAwesomeIcon
                                className='red' icon={faMagnifyingGlass}
                                size="lg" onClick={() => getSearchedEntryByContent()} />
                        </div>}
                    </div>

                    <div className='desktop search-box-container'>
                        <input
                            className='search' placeholder='find submitted entries...'
                            value={searchedContent} onChange={(e) => setSearchedContent(e.target.value)} />

                        <FontAwesomeIcon
                            className='red' icon={faMagnifyingGlass}
                            size="lg" onClick={() => getSearchedEntryByContent()} />
                    </div>

                    <div className={searchedResult?.length > 0 || error ? 'hide' : 'centre'}>
                        <textarea
                            className={error ? 'hide' : 'textArea'} rows={15}
                            placeholder="Dear Diary..."
                            onChange={(e) => {
                                setContent(e.target.value);
                                cacheActiveEntry(e);
                            }}
                            value={content} spellCheck={false}
                        />
                    </div>

                    {error && <ErrorComponent />}

                    <div className="centre">
                    <button
                        className={searchedResult.length > 0 || error ? 'hide' : 'save button'}
                        onClick={() => {
                            postNote();
                            setContent('');
                        }}
                        title={content?.length === 0 ? 'Write note' : 'SAVE'}
                        disabled={content?.length === 0}>
                        {content?.length === 0 ? 'Write note' : 'SAVE'}
                    </button>
                    </div>
                    {displayCard()}
                </div>
            </div>

            <div className='mobile'>
                {searchedContent.length <= 0 && <div className='fab-container'>
                    <button className='button iconbutton centre' onClick=
                        {
                            () => active === activeOnMobileDisplay.calendar
                                ? setActive(activeOnMobileDisplay.search)
                                : setActive(activeOnMobileDisplay.calendar)
                        }>
                        {(active === activeOnMobileDisplay.search) && <FontAwesomeIcon
                            color='white'
                            icon={faCalendar}
                            size="2x"
                        />}
                        {(active === activeOnMobileDisplay.calendar) && <FontAwesomeIcon
                            color='white'
                            icon={faMagnifyingGlass}
                            size="2x"
                        />}
                    </button>
                </div>}
            </div>
        </div>
    )
}
