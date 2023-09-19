import { render, screen } from '@testing-library/react';
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

        const text = screen.getByTestId('text');
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
        const input = await screen.getByTestId('todo');

        expect(input).toHaveClass("gap input");
    });

    test("New ToDos can be entered", async () => {
        const newTodo = "example new Todo";
        render(<ToDos />);

        const addButton = screen.getByRole('button', { name: 'Add' });
        await user.click(addButton);
        
        const input = await screen.getByRole('textbox');
        await user.type(input, newTodo);
        await user.click(addButton);

        const enteredTodo = await screen.getByTestId("todo-content");

        expect(input).toHaveValue(newTodo);
        expect(enteredTodo.innerHTML).toEqual(newTodo);
    });

    test("Upon checking the checkbox, the ToDo gets marked as completed", async () => {
        const newTodo = "example new Todo";
        render(<ToDos />);

        await user.click(screen.getByRole('button', { name: 'Add' }));
        
        const input = await screen.getByRole('textbox');
        await user.type(input, newTodo);
        await user.click(screen.getByRole('button', { name: 'Add' }));

        const checkbox = await screen.getAllByTestId("is-completed-checkbox")[0];
        await user.click(checkbox);
        const todoContent = await screen.getAllByTestId("todo-content")[0];

        expect(checkbox.checked).toBeTruthy();
        expect(todoContent.classList.contains("isCompleted"));
    });
});
