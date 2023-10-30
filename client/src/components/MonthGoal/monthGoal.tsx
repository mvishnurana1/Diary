import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getMonthTitle } from "../../helper/fns/date-fn";
import { UserTask } from "../../models/UserTask";
import './monthGoal.scss';

const defaultTask: UserTask = {
    content: '',
    date: new Date(),
    isCompleted: false
}

export function MonthGoal(): JSX.Element {
    const [todos, setToDos] = useState<UserTask[]>(getExistingTodos());
    const [isAdding, setIsAdding] = useState(false);
    const [active, setActive] = useState<UserTask>(defaultTask);

    function getExistingTodos(): UserTask[] {
        const tasks: UserTask[] = JSON.parse(localStorage.getItem('priorities')!);
        return tasks === null ? [] : tasks;
    }

    return (
        <section className="todos-section month-goal">
            <div>
                <h1 className="title">{getMonthTitle()}'s</h1>
                <h2 className="sub-title">top priorities</h2>
                <div className="gap">
                    {todos?.length === 0 && <span>Nothing to prioritise?</span>}
                    {todos?.length > 0 && todos.map((todo, index) =>
                        <div className="todo-item" key={index}>
                            <FontAwesomeIcon className="goal-logo" icon={faBullseye} />
                            <div className="flex-gap">
                                <div className={todo.isCompleted ? 'content isCompleted' : 'content'}>
                                    {todo.content}
                                </div>
                                <button
                                    className="trash-button"
                                    onClick={() => {
                                        todos.splice(index, 1);
                                        setToDos([...todos]);
                                        localStorage.setItem('priorities', JSON.stringify([...todos]));
                                    }}
                                    title="remove">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
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
                                }
                            }
                        }
                    placeholder="write new task here"/>
                }

                <button
                    className="logo-button centre"
                    title="Add"
                    onClick={() => {
                        setIsAdding(!isAdding);

                        const activeContent = active.content.trim();

                        if (activeContent.length > 0) {
                            setToDos([...todos, active]);
                            localStorage.setItem('priorities', JSON.stringify([...todos, active]));
                            setActive(defaultTask);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <div>Add</div>
                </button>
            </div>
            <hr />
        </section>
    )
}
