import { faMagnifyingGlass, faFaceSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { dateFormat } from '../../helper/date-fn';
import { EntryCard } from '../EntryCard/entry-card';
import './notes.scss';

export function Notes() {
    const BASE_URL = 'https://localhost:44315/';

    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [displaySearch, setDisplaySearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchedContent,  setSearchedContent] = useState(null);
    const [searchedResult, setSearchedResult] = useState([]);
    const [error,  setError] = useState(false);

    function getDate(date) {
        const formattedDate = dateFormat(date);
        fetchDataByDate(formattedDate);
    }

    function fetchDataByDate(date) {
        axios.get(`${BASE_URL}get/${date}`)
            .then((val) => {
                if (val.data.length === 0) {
                    setContent('');
                } else {
                    setContent(val.data[0].content);
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function postNewNotes() {
        setLoading(true);

        const newNote = {
            'submittedDateTime': startDate.toISOString(),
            'Content': content
        };

        axios.post(`${BASE_URL}post`, newNote)
            .then(() => {
                setContent(newNote.Content);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getSearchedEntryByContent() {
        setDisplaySearch(!displaySearch);
        setLoading(true);

        if (searchedContent === null || searchedContent.match(/^ *$/) !== null) {
            return;
        }

        axios.get(`${BASE_URL}searchbycontent/${searchedContent}`)
            .then((val) => {
                if (val.data.length === 0) {
                    setSearchedResult([]);
                } else {
                    setSearchedResult(val.data);
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
                setSearchedContent('');
            });
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
                    <EntryCard entries={searchedResult} />
                </div>
        }
    }

    return (
        <div className='notes-landing-page'>
            {displayError()}
            <div className='button-container'>
                <button className='logout button'>Log out</button>
            </div>
            <div className='search-box-container'>
                <input
                    className='search'
                    placeholder='find submitted entries...'
                    onChange={(e) => setSearchedContent(e.target.value)}
                />

                <FontAwesomeIcon
                    className='highlight'
                    icon={faMagnifyingGlass}
                    onClick={() => {
                        getSearchedEntryByContent(content);
                    }}
                    size="lg"
                />
            </div>

            <div className='notes-layout'>
                {
                    !loading 
                        ? <div className='left'>
                              <DatePicker
                                className={searchedResult?.length > 0 || error ? 'no-display': 'input'}
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    getDate(date);
                                    setLoading(true);
                                }}
                            />
                        </div>
                        : null 
                }
                
                {
                    error 
                        ?   <div className='error-container'>
                                <FontAwesomeIcon icon={faFaceSadCry} size="3x" />
                                <h6>Something went wrong. Please try again later!</h6>
                            </div> 
                        : null
                }

                {
                    loading
                        ? <ClipLoader color='red' size={150} />
                        : <textarea
                            className={
                                searchedResult?.length > 0 || error ? 'no-display': 'textArea' 
                            }
                            rows={15}
                            onChange={(e) => {
                                setContent(e.target.value);
                            }}
                            placeholder="Dear Diary..."
                            spellCheck={false}
                            value={content}
                        />
                }
            </div>

            <button
                className={searchedResult?.length > 0 || error || loading ? 'no-display' : 'save button'}
                variant="outline-primary"
                onClick={() => {
                    postNewNotes();
                    setLoading(true);
                    setContent('')
                }}
                disabled={content.length === 0}>
                {content.length === 0 ? 'Write note' : 'SAVE'}
            </button>

            {displayCard()}
        </div>
    )
}
