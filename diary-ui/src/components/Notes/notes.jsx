import axios from 'axios';
import { faMagnifyingGlass, faFaceSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { dateFormat } from '../../helper/date-fn';
import './notes.scss';

export function Notes() {
    const BASE_URL = 'https://localhost:44315/';

    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [displaySearch, setDisplaySearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');
    const [error,  setError] = useState(false);

    function displaySearchBox() {
        if (displaySearch) {
            return (
                <input
                    className='search'
                    placeholder='find submitted entries...'
                    onChange={(e) => setSearchedContent(e.target.value)}
                />
            )
        }
    }

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

    function displayError() {
        if (error) {
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }

    return (
        <div className='notes-landing-page'>
            <div className='button-container'>
                <button className='logout button'>Log out</button>
            </div>
            <div className='search-box-container'>
                {displaySearchBox()}
                <FontAwesomeIcon
                    className={displaySearch ? 'highlight': ''}
                    icon={faMagnifyingGlass}
                    onClick={() => {
                        setDisplaySearch(!displaySearch)
                    }}
                    size="lg"
                />
            </div>

            <div className='notes-layout'>
                <div className='left'>
                    <DatePicker
                        className='input'
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            getDate(date);
                            setLoading(true);
                        }}
                    />
                </div>

                {displayError()}
                
                {
                    error 
                        ?   <div className='error-container'>
                                <div>
                                    <FontAwesomeIcon icon={faFaceSadCry} size="4x" />
                                </div>
                                <h3>Something went wrong. Try again later!</h3>
                            </div> 
                        : ""
                }

                {
                    loading
                        ? <ClipLoader color='red' size={150} />
                        : <textarea
                            className={error ? 'textArea error': 'textArea'}
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

            {
                !error 
                    ? 
                    <button
                        className='save button'
                        variant="outline-primary"
                        onClick={() => {
                            postNewNotes();
                            setLoading(true);
                            setContent('')
                        }}
                        disabled={content.length === 0}>
                        {content.length === 0 ? 'Write note' : 'SAVE'}
                    </button>
                    : ""
            }
        </div>
    )
}
