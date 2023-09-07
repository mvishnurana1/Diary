import { act, render, screen } from '@testing-library/react';
import { LandingPage } from '../../components/LandingPage/landingPage.tsx';

describe('LandingPage Component', () => {
    test("renders header on the page", () => {
        act(() => render(<LandingPage />));

        const headerSection = document.getElementById("header");
        expect(headerSection).toBeInTheDocument();
    });
    
    test("renders the Google logo properly", () => {
        act(() => render(<LandingPage />));
    
        const googleLogo = screen.getByAltText("google-logo");

        expect(googleLogo).toBeInTheDocument();
    });

    test('render the footer with todays date', () => {
        act(() => render(<LandingPage />));
    
        const headerSection = document.getElementById("footer");

        expect(headerSection).toBeInTheDocument();
    });
});
