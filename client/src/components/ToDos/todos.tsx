import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { localisedDate } from "../../helper/date-fn";
import { UserTask } from "../../models/UserTask";
import './todos.scss';

const defaultTask : UserTask = {
    id: '',
    content: '',
    date: new Date(),
    isCompleted: false
}

export function ToDos(): JSX.Element {
    const [todos, setToDos] = useState<UserTask[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [active, setActive] = useState<UserTask>(defaultTask);
    
    return (
        <section className="todos-section">
            <div>
                <h1 className="title">Tasks </h1>
                    <h2 className="date">{localisedDate()}</h2>
                    <hr />
                    <div className="gap">
                        {todos.map((todo, index) => 
                            <div className="todo-item" key={index}>
                                <input 
                                    type={"checkbox"} 
                                    title={todo.content}
                                    onChange={(e) => {
                                        const itemToAdd: UserTask = {
                                            id: todo.id,
                                            content: todo.content,
                                            date: todo.date,
                                            isCompleted: e.target.checked
                                        };

                                        todos.splice(index, 1, itemToAdd);
                                        setToDos([...todos]);
                                    }}
                                />
                                <span className={todo.isCompleted ? 'isCompleted': ''}>
                                    {todo.content}
                                </span>
                            </div>
                        )}
                    </div>

                    {isAdding && <input className="gap input" onChange={(e) => { 
                            const value = e.target.value.trim();
                            if (value.length <= 0) {
                                return;
                            }

                            if (value.length > 0) {
                                const newToDo: UserTask = { 
                                    id: '100', 
                                    content: value, 
                                    date: new Date(), 
                                    isCompleted: false
                                };
                                setActive(newToDo)
                            }}
                        }
                    />}

                <button 
                    className="logo-button centre" 
                    title="Add"
                    onClick={() => {
                        setIsAdding(!isAdding);

                        const activeContent = active.content.trim();

                        if (activeContent.length > 0) {
                            setToDos([...todos, active]);
                            setActive(defaultTask);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={ faPlus } />
                    <div>Add</div>
                </button>
            </div>
        </section>
    )
}
