import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './notes.scss';

export function Notes() {
    const [content, setContent] = useState('');
    const [post, setPost] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div className='notes-landing-page'>
            <div className='title-container'>
                <h1>Notes App</h1>
            </div>
            <div className='notes-layout'>
                <div className='left'>
                    <DatePicker 
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
                className='save-button'
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
