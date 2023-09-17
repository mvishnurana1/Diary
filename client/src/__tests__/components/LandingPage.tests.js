import { render, screen } from '@testing-library/react';
import { LandingPage } from '../../components/LandingPage/landingPage.tsx';

describe('LandingPage Component', () => {
    test("renders header on the page", () => {
        render(<LandingPage />);
        const headerSection = screen.getByTestId("header");

        expect(headerSection.innerHTML).toEqual("Diary");
    });

    test("render the landing page text on screen", () => {
        render(<LandingPage />);
        const text = "Daily journaling helps you reflect on your daily choices and benefits your mental health. ";
        const st = screen.getByTestId("text");

        expect(st.innerHTML).toEqual(text);
    });

    test("renders the Google logo properly", () => {
        render(<LandingPage />);
        const googleLogo = screen.getByAltText("google-logo");

        expect(googleLogo).toBeInTheDocument();
    });

    test('render the footerContent', () => {
        render(<LandingPage />);
        const footerContent = /Blue Horse/;
        const footerText = screen.getByText(footerContent);
        
        expect(footerText).toBeInTheDocument();
    });

    test("render the text in the button with text 'Log In / Sign up'", () => {
        render(<LandingPage />);
        const buttonText = screen.getByText("Log In / Sign up");

        expect(buttonText).toBeInTheDocument();
    });
});
