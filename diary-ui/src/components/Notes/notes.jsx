import React, { useState } from 'react';
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

    function displaySearchBox() {
        if (displaySearch) {
            return (
                <input
                    className='search'
                    placeholder='find submitted entries...'
                />
            )
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
                        onChange={(date) => setStartDate(date)} 
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
                SAVE
            </button>
        </div>
    )
}
