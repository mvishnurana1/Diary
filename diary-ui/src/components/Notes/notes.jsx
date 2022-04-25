import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

export function Notes() {
    const [content, setContent] = useState('');
    const [post, setPost] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [displaySearch, setDisplaySearch] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');

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
        const YEAR = date.getFullYear();
        const MONTH = date.getMonth() + 1;
        const DATE = date.getDate();

        fetchData(`${YEAR}-${MONTH}-${DATE}`);
    }

    function fetchData(date) {
        axios.get(`https://localhost:44315/get/${date}`)
            .then((val) => {
                console.log(val.data);
            });
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
                        }}
                    />
                </div>

                <textarea
                    className='textArea'
                    rows={15}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Dear Diary..."
                    spellCheck={false}
                    value={content}
                />
            </div>
            <button
                className='save button'
                variant="outline-primary"
                onClick={() => {
                    setPost(!post);
                    console.log(content, startDate);
                    setContent('')
                }}
                disabled={content.length === 0}>
                {content.length === 0 ? 'Write note' : 'SAVE'}
            </button>
        </div>
    )
}
