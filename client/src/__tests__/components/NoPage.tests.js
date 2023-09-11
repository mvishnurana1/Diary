import { act, render, screen } from '@testing-library/react';
import { NoPage } from '../../components/common/NoPage/NoPage.tsx';

describe('No Page Component', () => {
    test('renders the error message successfully', () => {
        act(() => render(<NoPage />));
    
        const errorTextElement = screen.getByText('404 - Page Not Found');
        expect(errorTextElement).toBeInTheDocument();
    });
    
    test('renders the FontAwesomeIcon compponent with icon', () => {
        act(() => render(<NoPage />));

        const fontAwesomeIcon = screen.getByTitle("404");
        expect(fontAwesomeIcon).toBeInTheDocument();
    });
});
