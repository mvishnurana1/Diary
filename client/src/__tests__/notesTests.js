// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { screen, render, getByTestId, fireEvent, createEvent, waitFor } from "@testing-library/react";
import { Notes } from '../components/Notes/notes';

beforeEach(() => {
    render(<Notes />);
})

test("Write note button to render by default", async () => {
    expect(screen.getByRole('button', { title: 'Write note'})).toBeInTheDocument();
});

test("Error is displayed properly", async () => {
    render(<Notes />);
    const element = await screen.findAllByTitle('date-picker');

    fireEvent.mouseDown(element[1]);
    fireEvent.change(element[1], { target: { value: '2021-09-12' } });

    await waitFor(() => expect(screen.getByTestId('error-emoji')).toBeInTheDocument());
});
