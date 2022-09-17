import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { dateFormat } from '../../helper/date-fn';
import "./entry-card.scss";

export function EntryCard(props) {
    const { 
        entries, 
        setContent, 
        setSearchedContent,
        setSearchedResult,
        setStartDate 
    } = props;

    function handleClick(entry) {
        setContent(entry.content);
        setSearchedContent('');
        setStartDate(new Date(entry.submittedDateTime));
        setSearchedResult([]);
    }

    return  entries.map((entry) => {
        return (
            <div className="entry-card-layout" key={entry.entryID}>
                <div className="entry-card">
                    <div className="entry-content">
                        {entry.content}
                    </div>
                    <div className="date-time-log">
                        <div>
                            <span className="strong">posted on: </span>
                            <span className="time">{dateFormat(entry.submittedDateTime)}</span>
                        </div>
                        <div>
                            <FontAwesomeIcon
                                className='highlight left'
                                icon={faPencil}
                                onClick={() => handleClick(entry)}
                                size="lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    })
}
