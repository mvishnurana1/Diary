import { render, screen, waitFor } from '@testing-library/react';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import dateFormat from '../../helper/date-fn';

describe("SearchResults Component:", () => {
    const entries = [{
        entryID: "d9706960-129b-4cb7-ba5c-b420fd57ec52",
        userID: "2e6f0f9e-7cc3-444d-90b2-28feda7913e9",
        submittedDateTime: new Date(),
        content: "It has roots in a piece of classical..."
    }, {
        entryID: "d11a6993-b208-42ec-9f43-1a87ae46d612",
        userID: "2e6f0f9e-7cc3-444d-90b2-28feda7913e9",
        submittedDateTime: new Date(),
        content: "root of Latin literature from 45 BC..."
    }];

    test("Should render the default text - 'No Matches Found for your search' when no matching results are found", () => {
        const defaultText = 'No Matches Found for your search';
        render(<SearchResults entries={[]} />);
        
        waitFor(() => expect(screen.findByText(defaultText)).toBeInTheDocument());
    });

    test("Should render the entries when matches are found", () => {
        render(<SearchResults entries={entries} />);
        
        waitFor(() => expect(screen.findByText(entries[0].content)).toBeInTheDocument());
        waitFor(() => expect(screen.findByText(entries[0].content)).toHaveClass("entry-content"));
    });

    test("Should render the entries for each dateTime log", () => {
        render(<SearchResults entries= {entries} />);
        
        waitFor(() => expect(dateFormat(entries[0].submittedDateTime)).toBeInTheDocument());
        waitFor(() => expect(dateFormat(entries[1].submittedDateTime)).toHaveClass("time"));

        waitFor(() => expect(dateFormat(entries[1].submittedDateTime)).toBeInTheDocument());
        waitFor(() => expect(dateFormat(entries[2].submittedDateTime)).toHaveClass("time"));
    });

    test("Should render the edit button next to every result found in search", async () => {
        render(<SearchResults entries={entries} />);
        
        const editButton = await screen.getAllByRole("button")[0];

        expect(editButton).toHaveClass('icon-button');
    });
});
