import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { localisedDate } from "../../helper/date-fn";
import { UserTask } from "../../models/UserTask";
import './todos.scss';

const defaultTask : UserTask = {
    content: '',
    date: new Date(),
    isCompleted: false
}

export function ToDos(): JSX.Element {
    const [todos, setToDos] = useState<UserTask[]>(getExistingTodos());
    const [isAdding, setIsAdding] = useState(false);
    const [active, setActive] = useState<UserTask>(defaultTask);
    
    function getExistingTodos(): UserTask[] {
        const tasks: UserTask[] = JSON.parse(localStorage.getItem('todos')!);
        return tasks;
    }

    return (
        <section className="todos-section">
            <div>
                <h1 className="title">{localisedDate()}</h1>
                    <h2 className="sub-title">Tasks</h2>
                    <div className="gap">
                        {todos.map((todo, index) => 
                            <div className="todo-item" key={index}>
                                <input 
                                    checked={todo.isCompleted}
                                    type={"checkbox"}
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
                                <span className={todo.isCompleted ? 'isCompleted': ''}>
                                    {todo.content}
                                </span>
                            </div>
                        )}
                    </div>

                    {isAdding && 
                        <input 
                            className="gap input" 
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
                                    }}
                            }
                            placeholder="write new task here"
                    />}

                <button 
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
                    <FontAwesomeIcon icon={ faPlus } />
                    <div>Add</div>
                </button>
            </div>
            <hr />
        </section>
    )
}
