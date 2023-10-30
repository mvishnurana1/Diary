import { render, screen } from '@testing-library/react';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { dateFormat } from '../../helper/';

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

    test("Should render the default text - 'No Matches Found for your search' when no matching results are found", async () => {
        const defaultText = 'No Matches Found for your search';
        render(<SearchResults entries={[]} />);
        const textNode = await screen.findByText(defaultText); 
        
        expect(textNode.innerHTML).toBe(defaultText);
    });

    test("Should render the entries when matches are found", async () => {
        render(<SearchResults entries={entries} />);
        
        const contentNode = await screen.findAllByTestId('entry-content');

        expect(contentNode[0].innerHTML).toBe(entries[0].content);
        expect(contentNode[1].innerHTML).toBe(entries[1].content);
    });

    test("Should render the entries for each dateTime log", async () => {
        render(<SearchResults entries= {entries} />);

        const dateTimeNode = await screen.findAllByTestId('date-time');

        expect(dateTimeNode[0].innerHTML).toBe(dateFormat(entries[0].submittedDateTime));
        expect(dateTimeNode[1].innerHTML).toBe(dateFormat(entries[1].submittedDateTime));
    });

    test("Should render the edit button next to every result found in search", async () => {
        render(<SearchResults entries={entries} />);
        
        const editButton = await screen.getAllByRole("button");

        expect(editButton[0]).toHaveClass('icon-button');
        expect(editButton[1]).toHaveClass('icon-button');
    });
});
