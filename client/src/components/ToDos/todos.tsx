import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import './todos.scss';

interface UserTask {
    id: string,
    content: string,
    date: Date,
    isCompleted: boolean
}

const defaultTask : UserTask = {
    id: '',
    content: '',
    date: new Date(),
    isCompleted: false
}

export function ToDos(): JSX.Element {
    const defaultToDos: UserTask[] = [{
        id: '1',
        content: 'some bullshit',
        date: new Date('2022-10-19'),
        isCompleted: true
    }, {
        id: '2',
        content: 'some more bullshit',
        date: new Date('2022-10-19'),
        isCompleted: false
    }];

    const [todos, setToDos] = useState(defaultToDos);
    const [isAdding, setIsAdding] = useState(false);
    const [active, setActive] = useState<UserTask>(defaultTask);

    return (
        <>
            <section className="todos-section">
                <div>
                    <h1 className="title">To Dos {new Date().toLocaleDateString()}</h1>
                        <div className="gap">
                            {todos.map((todo) => 
                                <div className="todo-item" key={todo.id}>
                                    <input 
                                        type={"checkbox"} 
                                        title={todo.content} 
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
                                    const newToDo: UserTask = { id: '100', content: value, date: new Date(), isCompleted: false };
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
        </>
    )
}
