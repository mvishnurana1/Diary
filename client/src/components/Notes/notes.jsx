import { useAuth0 } from '@auth0/auth0-react';
import { 
    faFaceSadCry, 
    faMagnifyingGlass, 
    faXmark 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import 
    React, { 
        useEffect, 
        useState 
    } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader";
import { dateFormat } from '../../helper/date-fn';
import { EntryCard } from '../EntryCard/entry-card';
import './notes.scss';

export function Notes() {
    const BASE_URL = 'https://localhost:44315/';

    const [content, setContent] = useState('');
    const [displaySearch, setDisplaySearch] = useState(false);
    const [error,  setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchedContent,  setSearchedContent] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [searchedResult, setSearchedResult] = useState([]);
    const [token, setToken] = useState();

    const { getAccessTokenSilently, logout, user } = useAuth0();

    // useEffect(() => {
    //     (async () => {
    //         const accessToken = await getAccessTokenSilently();
    //         setToken(accessToken);
    //         window.localStorage.setItem("accessToken", accessToken);
    //     })();
    // });

    function getDate(date) {
        const formattedDate = dateFormat(date);
        fetchDataByDate(formattedDate);
    }

    function localStorage() {
        window.localStorage.setItem("user-verified", user?.email_verified);
    }

    function fetchDataByDate(date) {
        axios.get(`${BASE_URL}get/?date=${date}`)
            .then((val) => {
                if (val.data.diaryEntry === null) {
                    setContent('');
                } else {
                    setContent(val.data.diaryEntry.content);
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
        if (content === null || content.match(/^ *$/) !== null) {
            return;
        } else {
            setLoading(true);

            const newNote = {
                'submittedDateTime': startDate,
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
    }

    function getSearchedEntryByContent() {
        setDisplaySearch(!displaySearch);

        if (searchedContent === null || searchedContent.match(/^ *$/) !== null) {
            return;
        } else {
            setLoading(true);

            axios.get(`${BASE_URL}searchbycontent/?content=${searchedContent}`)
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
            });
        }
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
            {displayError()}
            {localStorage()}
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
                        getSearchedEntryByContent(content);
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
                                selected={startDate}
                                onChange={(date) => {
                                    getDate(date);
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
                        ? <div className="centre"> <ClipLoader color='red' size={150} /> </div>
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
                    ?   <div className='error-container'>
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
