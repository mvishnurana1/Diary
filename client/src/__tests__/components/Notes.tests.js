import { act, render, screen, waitFor } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import { mocked } from "jest-mock";
import { Notes } from '../../components/Notes/notes.tsx';

const user = {
    id: "user_id",
    email: "johndoe@me.com",
    email_verified: true,
    sub: "google-oauth2|12345678901234",
};


jest.mock("@auth0/auth0-react");
const mockedUseAuth0 = mocked(useAuth0, true);

// To fix the warning from the ActivityChart Component
jest.mock('react-chartjs-2', () => ({
    ...jest.requireActual('react-chartjs-2'),
    Line: jest.fn(),
}));

jest.mock('../../components/ActivityChart/ActivityChart', () => ({
    ...jest.requireActual('../../components/ActivityChart/ActivityChart'),
    Line: jest.fn(() => <div>LINE</div>),
}));

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
        await act(async () => render(<Notes />));
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

        await act(async () => render(<Notes />));

        const SearchResultsComponent = document.getElementsByClassName("entry-card-container");
        expect(SearchResultsComponent).not.toBeNull();
    });

    describe("Should render the Performance Chart for Logged in User:", () => {
        test("should render the chart performance in the document:", async () => {
            await act(async () => render(<Notes />));
    
            expect(
                waitFor(() => 
                    screen.getByText("LINE").toBeInTheDocument()));
        });

        test("should render the 'Activity' header in the document:", async () => {
            await act(async () => render(<Notes />));
    
            expect(
                waitFor(() => 
                    screen.getByRole("header", { level: 1, name: 'Activity' })
                    .toBeInTheDocument()));
        });

        test("should render the 'this month' header in the document:", async () => {
            await act(async () => render(<Notes />));
    
            expect(
                waitFor(() => 
                    screen.getByRole("header", { level: 2, name: 'this month' })
                    .toBeInTheDocument()));
        });
    });
});
