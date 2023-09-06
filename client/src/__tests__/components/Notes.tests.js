import { act, render } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import { mocked } from "jest-mock";
import { Notes } from '../../components/Notes/notes.tsx';
import ReactDOM from 'react-dom/client';
import fetchSearchedEntryByContent from '../../utils/api/fetchSearchedEntryByContent.ts';

const user = {
    id: "user_id",
    email: "johndoe@me.com",
    email_verified: true,
    sub: "google-oauth2|12345678901234",
};

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

jest.mock("@auth0/auth0-react");
const mockedUseAuth0 = mocked(useAuth0, true);
let mockedfetchSearchedEntryByContent = mocked(fetchSearchedEntryByContent);

describe('Notes Component when successfully authenticated', () => {
    beforeEach(() => {
        mockedUseAuth0.mockReturnValue({
            isAuthenticated: true,
            user,
            logout: jest.fn(),
            loginWithRedirect: jest.fn(),
            getAccessTokenWithPopup: jest.fn(),
            getAccessTokenSilently: jest.fn(),
            getIdTokenClaims: jest.fn(),
            loginWithPopup: jest.fn(),
            isLoading: false,
            token: "eyrrgfgrbr",
        });

        window.fetch = jest.fn();
    });

    test("Header Component is rendered when user is authenticated", async () => {
        await act( async () => {
            await ReactDOM.createRoot(container).render(<Notes />);
        });
    
        const headerComponent = document.getElementById("header");
    
        expect(headerComponent).toBeInTheDocument();
    });

    test("SearchResults component render properly when search there are search results", async () => {
        const diaryEntries = [{
            entryID: "1",
            userID: user.id,
            submittedDateTime: new Date(),
            content: "some dummy content"
        }, {
            entryID: "2",
            userID: user.id,
            submittedDateTime: new Date(),
            content: "some dummy content"
        }];

        window.fetch = jest.fn();

        mockedfetchSearchedEntryByContent = window.fetch.mockResolvedValueOnce({
            json: async () => [diaryEntries]
        });

        await act( async () => {
            await ReactDOM.createRoot(container).render(<Notes />);
        });
    

        const SearchResultsComponent = document.getElementsByClassName("entry-card-container");
        expect(SearchResultsComponent).not.toBeNull();
    });
});
