import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { dateFormat } from '../../helper/date-fn';
import { DiaryEntry } from "../../models";
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

    if (entries?.length === 0) {
        return <>
            <h1>No Matches Found for your search</h1>
        </>
    } else {
        return <>{
            entries?.map((entry: DiaryEntry) => {
                return (
                    <div className="entry-card-layout" key={entry.entryID}>
                        <div className="entry-card">
                            <div data-testid="entry-content" className="entry-content">
                                {entry.content}
                            </div>
                            <div className="date-time-log">
                                <>
                                    <span className="strong">posted on: </span>
                                    <span data-testid="date-time" className="time">{dateFormat(entry.submittedDateTime)}</span>
                                </>
                                <>
                                    <button
                                        className='icon-button'
                                        name='edit-button' 
                                        onClick={() => handleClick(entry)}>
                                        <FontAwesomeIcon
                                            className='highlight left'
                                            icon={faPencil}
                                            size="lg"
                                        />
                                    </button>
                                </>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    }
}
