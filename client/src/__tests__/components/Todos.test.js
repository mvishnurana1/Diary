import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ToDos from '../../components/ToDos/todos.tsx';

describe("ToDos Component", () => {
    test("Renders today's date by default", () => {
        render(<ToDos />);

        const date = screen.getByRole('heading', { level: 1 });

        expect(date).toContainHTML(new Date().toDateString());
    });

    test("Renders today's date by default", () => {
        render(<ToDos />);

        const taskHeading = screen.getByRole('heading', { level: 2 });

        expect(taskHeading).toHaveClass("sub-title");
        expect(taskHeading).toContainHTML("Tasks");
    });

    test("Renders the text 'Nothing to do?' by default", () => {
        render(<ToDos />);

        const text = document.getElementById('text');
        expect(text).toContainHTML("Nothing to do?");
    });

    test("Renders the 'Add' button by default", () => {
        render(<ToDos />);

        const addButton = screen.getByRole('button');
        expect(addButton).toHaveClass("logo-button centre");
    });

    test("On clicking the 'Add' button the textfield appears to enter new ToDo", async () => {
        render(<ToDos />);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        
        expect(
            waitFor(() => 
                screen.getByLabelText("todo")
                .toBeInTheDocument()));
    });

    test("New ToDos can be entered", async () => {
        const newTodo = "example new Todo";
        const defaultText = "Nothing to do?";
        render(<ToDos />);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        
        const input = await screen.getByRole('textbox');
        await user.type(input, newTodo);
        await user.click(screen.getByRole('button', { name: 'Add' }));

        expect(input).toHaveValue(newTodo);
        waitFor(() => expect(screen.getByText(newTodo)).toBeInTheDocument());
        waitFor(() => expect(screen.getByText(defaultText)).not.toBeInTheDocument());
    });

    test("On adding new ToDos, upon checking the checkbox the text gets striked out", async () => {
        const newTodo = "example new Todo";
        render(<ToDos />);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        
        const input = await screen.getByRole('textbox');
        await user.type(input, newTodo);
        await user.click(screen.getByRole('button', { name: 'Add' }));

        const checkbox = document.getElementById('checkbox');
        await user.click(checkbox);

        waitFor(() => expect(document.getElementById("todo-content")).toHaveClass("content isCompleted"));
    });
});
