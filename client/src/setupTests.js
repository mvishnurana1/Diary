// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { screen, render } from "@testing-library/react";
import Notes from './components/Notes';

test("displays ClipLoader while loading data", async () => {
    const notes = render(<Notes />);

    

    expect(notes);
});

test("displays error-container when error is true", async () => {
    const notes = render(<Notes />);


});
