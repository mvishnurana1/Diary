import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { localisedDate } from "../../helper";
import { UserTask } from "../../models";
import './todos.scss';

const defaultTask: UserTask = {
    content: '',
    date: new Date(),
    isCompleted: false
}

function ToDos(): JSX.Element {
    const [todos, setToDos] = useState<UserTask[]>(getExistingTodos());
    const [isAdding, setIsAdding] = useState(false);
    const [active, setActive] = useState<UserTask>(defaultTask);

    function getExistingTodos(): UserTask[] {
        const tasks: UserTask[] = JSON.parse(localStorage.getItem('todos')!);
        return tasks === null ? [] : tasks;
    }

    return (
        <section className="todos-section">
            <>
                <h1 className="title">{localisedDate()}</h1>
                <h2 className="sub-title">Tasks</h2>
                <div className="gap">
                    {todos?.length === 0 && <span data-testid="text">Nothing to do?</span>}
                    {todos?.length > 0 && todos.map((todo, index) =>
                        <div className="todo-item" key={index}>
                            <label htmlFor="todo"></label>
                            <input
                                data-testid="is-completed-checkbox"
                                checked={todo.isCompleted}
                                type="checkbox"
                                title={todo.content}
                                onChange={(e) => {
                                    const itemToAdd: UserTask = {
                                        content: todo.content,
                                        date: todo.date,
                                        isCompleted: e.target.checked
                                    };

                                    todos.splice(index, 1, itemToAdd);
                                    setToDos([...todos]);
                                    const jsonTodos = JSON.stringify(todos);
                                    localStorage.setItem('todos', jsonTodos);
                                }}
                            />
                            <div className="flex-gap">
                                <div data-testid="todo-content" className={todo.isCompleted ? 'content isCompleted' : 'content'}>
                                    {todo.content}
                                </div>
                                <button
                                    aria-label="delete task"
                                    data-testid="trash-button"
                                    className="trash-button"
                                    onClick={() => {
                                        todos.splice(index, 1);
                                        setToDos([...todos]);
                                    }}
                                    title="remove">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isAdding &&
                    <>
                        <label htmlFor="todo"></label>
                        <input
                            className="gap input"
                            data-testid="todo"
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                if (value.length <= 0) {
                                    return;
                                }

                                if (value.length > 0) {
                                    const newToDo: UserTask = {
                                        content: value,
                                        date: new Date(),
                                        isCompleted: false
                                    };
                                    setActive(newToDo)
                                }
                            }
                            }
                            placeholder="write new task here"
                        />
                    </>
                }

                <button
                    aria-label="add task"
                    className="logo-button centre"
                    title="Add"
                    onClick={() => {
                        setIsAdding(!isAdding);

                        const activeContent = active.content.trim();

                        if (activeContent.length > 0) {
                            setToDos([...todos, active]);
                            localStorage.setItem('todos', JSON.stringify([...todos, active]));
                            setActive(defaultTask);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <div>Add</div>
                </button>
            </>
            <hr />
        </section>
    )
}

export default ToDos;
