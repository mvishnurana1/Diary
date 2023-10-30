import { fetchUser } from  './calls/fetchUser';
import { fetchDatesOfNotesForLoggedInUser } from  './calls/fetchDatesOfNotesForLoggedInUser';
import { fetchSearchedEntryByContent } from  './calls/fetchSearchedEntryByContent';
import { fetchTodos } from  './calls/fetchTodos';
import { postNewNotes } from  './calls/postNewNotes';
import { fetchEntryByDate } from  './calls/fetchEntryByDate';

export { fetchDatesOfNotesForLoggedInUser, fetchEntryByDate, fetchUser, 
    fetchSearchedEntryByContent, fetchTodos, postNewNotes };
