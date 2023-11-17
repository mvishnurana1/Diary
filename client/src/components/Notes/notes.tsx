import { useContext, useState } from 'react';
import { faMagnifyingGlass, faXmark, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import { Header } from '../common';
import { AuthContext, NotesContext } from '../../context';
import { DiaryEntry } from '../../models';
import { ActiveOnMobileDisplay } from '../../models/AppModels/ActiveOnMobileDisplay';
import { fetchSearchedEntryByContent } from '../../utils/api';
import { SearchResults } from '../SearchResults/SearchResults';
import ToDos  from '../ToDos/todos';
import { OnError } from '../Error/error';
import ClipLoader from "react-spinners/ClipLoader";
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

export function Notes(): JSX.Element {
    const [displaySearch, setDisplaySearch] = useState(false);
    const [error, setError] = useState(false);
    // const [searchedContent, setSearchedContent] = useState('');
    const [searchedResult, setSearchedResult] = useState<DiaryEntry[]>([]);
    const [active, setActive] = useState<ActiveOnMobileDisplay>(ActiveOnMobileDisplay.search);
    
    const { loggedInUser, loading, authError } = useContext(AuthContext);
    const {
        setContent, content,
        validNoteDates, postNote, fetchDiaryEntryContentByDate, 
        setStartDate, startDate
    } = useContext(NotesContext);

    // async function getSearchedEntryByContent() {
    //     setDisplaySearch(!displaySearch);
    //     if (searchedContent === null || searchedContent.match(/^ *$/) !== null) return;
        
    //     try {
    //         const searchResult = await fetchSearchedEntryByContent({ userID: loggedInUser.userID, content: searchedContent });
    //         setSearchedResult(searchResult);

    //     } catch (err) {
    //         setError(true);
    //     }
    // }

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
                        {/* <SearchResults
                            entries={searchedResult}
                            setContent={setContent}
                            setSearchedContent={setSearchedContent}
                            setStartDate={setStartDate}
                            setSearchedResult={setSearchedResult}
                        /> */}
                    </div>
                    <div className="center">
                        <FontAwesomeIcon
                            className='red'
                            icon={faXmark}
                            onClick={() => {
                                setSearchedResult([]);
                                // setSearchedContent('');
                            }}
                            size="lg"
                        />
                    </div>
                </div>
            )
        }
    }

    return (
    <>
        {loading && !authError && 
            <div className='horizontally-centred m-5'> 
                <ClipLoader color='rgb(235, 88, 88)' size={150} /> 
            </div>
        }
        {loggedInUser.isAuthenticated && <div className='notes-landing-page'>
                <div className='mobile' id='header'>
                    <Header />
                </div>

            <div className='notes'>
                <>
                    {displayError()}
                </>

                {validNoteDates && !searchedResult.length &&
                    <div className='left'>
                        <div className={error ? 'hide' : 'datepicker'}>
                            <div className='mobile'>
                                {active === ActiveOnMobileDisplay.calendar &&
                                    <DatePicker
                                        highlightDates={validNoteDates}
                                        inline
                                        maxDate={new Date()}
                                        onChange={(date: Date) => {
                                            try {
                                                fetchDiaryEntryContentByDate(date);
                                            } catch (err) {
                                                setError(true);
                                            }
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
                                            try {
                                                fetchDiaryEntryContentByDate(date);
                                            } catch (err) {
                                                setError(true);
                                            }
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

                <div className={searchedResult.length > 0 ? 'hide' : 'vertical-rule'}></div>

                <div className='column'>
                    <div className='desktop'>
                        <Header />
                    </div>

                    {/* <div className='mobile'>
                        {(active === ActiveOnMobileDisplay.search) && <div className='search-box-container'>
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
                    </div> */}

                    {/* <div className='desktop search-box-container'>
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
                    </div> */}

                    <div className={searchedResult?.length > 0 || error ? 'hide' : 'centre'}>
                        <textarea
                            className={error ? 'hide' : 'textArea'}
                            rows={15}
                            placeholder="Dear Diary..."
                            onChange={(e) => {
                                setContent(e.target.value);
                            }}
                            spellCheck={false}
                            value={content}
                        />
                    </div>

                    {error && <OnError />}
                    <div className="centre">
                        <button
                            className={searchedResult.length > 0 || error ? 'hide' : 'save button'}
                            onClick={() => {
                                try {
                                    postNote();
                                } catch (err) {
                                    setError(true);
                                }
                            }}
                            title={content?.length === 0 ? 'Write note' : 'SAVE'}
                            disabled={content?.length === 0}>
                            {content?.length === 0 ? 'Write note' : 'SAVE'}
                        </button>
                    </div>
                    {displayCard()}
                </div>
            </div>

            {/* <div className='mobile'>
                {searchedContent.length <= 0 && <div className='fab-container'>
                    <button className='button iconbutton centre' onClick=
                        {() => active === ActiveOnMobileDisplay.calendar
                                ? setActive(ActiveOnMobileDisplay.search)
                                : setActive(ActiveOnMobileDisplay.calendar)}>
                        {(active === ActiveOnMobileDisplay.search) && <FontAwesomeIcon color='white' icon={faCalendar} size="2x" />}
                        {(active === ActiveOnMobileDisplay.calendar) && <FontAwesomeIcon color='white' icon={faMagnifyingGlass} size="2x" />}
                    </button>
                </div>}
            </div> */}
        </div>}
        {authError && 
            <OnError 
                classes='m-5' 
                message='Something went terribly wrong. Please try again later...!' 
                renderBackButton
            />
        }
    </>
    )
}
