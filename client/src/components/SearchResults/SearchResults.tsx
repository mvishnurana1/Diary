import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { dateFormat } from '../../helper/date-fn';
import { DiaryEntry } from "../../models/DiaryEntry";
import './SearchResults.scss';

interface searchResultsProp {
    entries: DiaryEntry[],
    setContent: (string: string) => void,
    setSearchedContent: (string: string) => void,
    setSearchedResult: (resultedList: DiaryEntry[]) => void,
    setStartDate: (date: Date) => void
};

export function SearchResults(props: searchResultsProp): JSX.Element {
    const {
        entries,
        setContent,
        setSearchedContent,
        setSearchedResult,
        setStartDate
    } = props;

    function handleClick(entry: DiaryEntry) {
        setContent(entry.content);
        setSearchedContent('');
        setStartDate(new Date(entry.submittedDateTime));
        setSearchedResult([]);
    }

    if (entries?.length) {
        return <>
            <h1>No Matches Found for your search</h1>
        </>
    } else {
        return <>{
            entries?.map((entry: DiaryEntry) => {
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
            })}
        </>
    }
}
