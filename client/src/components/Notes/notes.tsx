import { useAuth0 } from '@auth0/auth0-react';
import { faFaceSadCry, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { EntryCard } from '../EntryCard/entry-card';
import { dateFormat } from '../../helper/date-fn';
import { FetchEntriesByDateModel } from '../../models/FetchEntriesByDateModel';
import { DiaryEntryContext } from '../../providers/notes/NotesContext';
import './notes.scss';

export function Notes(): JSX.Element {
    const [content, setContent] = useContext(DiaryEntryContext);
    const [displaySearch, setDisplaySearch] = useContext(DiaryEntryContext);
    const [error,  setError] = useContext(DiaryEntryContext);
    const [loading, setLoading] = useContext(DiaryEntryContext);
    const [searchedContent,  setSearchedContent] = useContext(DiaryEntryContext);
    const [startDate, setStartDate] = useContext(DiaryEntryContext);
    const [searchedResult, setSearchedResult] = useContext(DiaryEntryContext);
    const { getSearchedEntryByContent, fetchDiaryEntryContentByDate, postNewNotes } = useContext(DiaryEntryContext);

    const {
        getAccessTokenSilently, 
        isAuthenticated,
        loginWithRedirect,
        user
    } = useAuth0();

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem('photo', user?.picture!);
            }
            catch(err: any) {
                if (!isAuthenticated && (err.error === 'login_required' || err.error === 'consent_required')) {
                    loginWithRedirect();
                }
            }
        })();
    });

    function FormApiCall(date: Date): void {
        const formattedDate = dateFormat(date);
        
        const obj : FetchEntriesByDateModel = {
            formattedDate: formattedDate,
            loggedInUserID: '0da0fce4-a693-4bb3-b1bb-69f1db0263a7'
        }

        fetchDiaryEntryContentByDate(obj);
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
                                    FormApiCall(date);
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
