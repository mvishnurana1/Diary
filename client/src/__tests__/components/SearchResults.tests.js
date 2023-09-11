import { render, screen, waitFor } from '@testing-library/react';
import { SearchResults } from '../../components/SearchResults/SearchResults';

describe("SearchResults Component:", () => {
    test("Should render the default text when no matching results are found", () => {
        render(
        <SearchResults 
            entries={[]} 
            setContent={jest.fn()} 
            setSearchedContent={jest.fn()}
            setSearchedResult={jest.fn()}
            setStartDate={jest.fn().mockResolvedValue(new Date())} />);
        
        waitFor(() => expect(screen.findByText('No Matches Found for your search')).toBeInTheDocument());
    });
});
