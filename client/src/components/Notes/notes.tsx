import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { faMagnifyingGlass, faXmark, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import { dateFormat } from '../../helper';
import { DiaryEntry, LoggedInUser } from '../../models';
import { fetchUser, fetchDatesOfNotesForLoggedInUser, 
    fetchEntryByDate, postNewNotes, fetchSearchedEntryByContent } from '../../utils/api';
import { activeOnMobileDisplay } from '../../models/AppModels/activeOnMobileDisplay';
import { Header } from '../common/Header/Header';
import { SearchResults } from '../SearchResults/SearchResults';
import ToDos  from '../ToDos/todos';
import { OnError } from '../Error/error';
// import PerformanceChart from '../ActivityChart/ActivityChart';
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
    const [error, setError] = useState(false);
    const [searchedContent, setSearchedContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [searchedResult, setSearchedResult] = useState<DiaryEntry[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>(defaultUser);
    const [validNoteDates, setValidNoteDates] = useState<Date[]>([]);
    const [hasInit, setInit] = useState(false);
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
            catch (err: any) {
                if (!isAuthenticated && (err.error === 'login_required' || err.error === 'consent_required')) {
                    loginWithRedirect();
                }
            }
        })();
    });

    useEffect(() => {
        if (hasInit) {
            return;
        }
        fetchUser()
            .then(user => { setLoggedInUser(user)})
            .then(() => {
                if (loggedInUser.userID === undefined) {
                    return;
                } 
                setInit(true);
                fetchDatesOfNotesForLoggedInUser(loggedInUser.userID)
                .then(res => {
                    const dates = res?.map(res => new Date(res));
                    setValidNoteDates(dates!);
                })
            });
    }, [hasInit, loggedInUser]);

    async function postCachedActivity() {
        const active = JSON.parse(localStorage.getItem('active')!);

        if (!active?.content || !active?.startDate) {
            return;
        } else {
            try {

                const diaryEntry = await postNewNotes(
                {
                    UserID: loggedInUser.userID,
                    Content: active?.content,
                    SubmittedDateTime: dateFormat(active?.startDate)
                });

                setContent(diaryEntry.content);
            } catch (err) {
                setError(true);
            } finally {
                localStorage.removeItem('active');
            }
        }
    }

    async function fetchDiaryEntryContentByDate(date: Date) {
        try {
            const content = await fetchEntryByDate(
                { formattedDate: dateFormat(date), loggedInUserID: loggedInUser.userID }
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
        }
        try {
            const diaryEntry = await postNewNotes(
            {
                UserID: loggedInUser.userID,
                Content: content,
                SubmittedDateTime: dateFormat(startDate)
            });

            setContent(diaryEntry.content);
        } catch (err) {
            setError(true);
        } finally {
            setValidNoteDates([...validNoteDates, startDate]);
            setContent('');
        }
    }

    async function getSearchedEntryByContent() {
        setDisplaySearch(!displaySearch);
        if (searchedContent === null || searchedContent.match(/^ *$/) !== null) {
            return;
        } else {
            try {
                const searchResult = await fetchSearchedEntryByContent
                    ({ userID: loggedInUser.userID, content: searchedContent });

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

                {validNoteDates && !searchedResult.length &&
                    <div className='left'>
                        <div className={error ? 'no-display' : 'datepicker'}>
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
                            <div className={error ? 'no-display' : 'desktop datepicker'}>
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
                                {/* <PerformanceChart /> */}
                            </div>
                        </div>
                    </div>}

                <div className={searchedResult.length > 0 ? 'no-display' : 'vertical-rule'}></div>

                <div className='column'>
                    {isAuthenticated && user &&
                        <div className='desktop'>
                            <Header
                                user={user}
                                logout={logout}
                            />
                        </div>
                    }

                    <div className='mobile'>
                        {(active === activeOnMobileDisplay.search) && <div className='search-box-container'>
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
                        </div>}
                    </div>

                    <div className='desktop search-box-container'>
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
                            className={error ? 'no-display' : 'textArea'}
                            rows={15}
                            placeholder="Dear Diary..."
                            onChange={(e) => {
                                setContent(e.target.value);
                                cacheActiveEntry(e);
                            }}
                            spellCheck={false}
                            value={content}
                        />
                    </div>

                    {error && <OnError />}
                    <div className="centre">
                        <button
                            className={searchedResult.length > 0 || error ? 'no-display' : 'save button'}
                            onClick={() => {
                                postNote();
                                setContent('')
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
