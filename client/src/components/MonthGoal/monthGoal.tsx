import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getMonthTitle } from "../../helper/date-fn";
import { UserTask } from "../../models/UserTask";
import { fetchPriorityForMonth } from "../../utils/api/monthPriorities";
import { IMonthPriorityResponseModel } from "../../models/MonthPriority";
import './monthGoal.scss';

const defaultTask : UserTask = {
    content: '',
    date: new Date(),
    isCompleted: false
}

type monthlyGoalsProps = {
    userID: string
};

export function MonthGoal(): JSX.Element {
    // const [todos, setToDos] = useState<UserTask[]>(getExistingTodos());
    const [isAdding, setIsAdding] = useState(false);
    const [priorities, setPriorities] = useState<IMonthPriorityResponseModel[]>([]);
    const [active, setActive] = useState<UserTask>(defaultTask);

    useEffect(() => {
      (async () => {
        try {
            const prioritiesList = await fetchPriorityForMonth('d7c4c5d9-6d5b-4708-3f63-08dab43498f2');
            setPriorities([...prioritiesList]);
            console.log(priorities);
        } catch(err: any) {

        }
      })();
    }, []);
    
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
                        {priorities?.length === 0 && <span>Nothing to prioritise?</span>}
                        {priorities?.length > 0 && priorities.map((priority, index) => 
                            <div className="todo-item" key={index}>
                                <FontAwesomeIcon className="goal-logo" icon={ faBullseye } />

                                <div className="flex-gap">
                                    <div className='content'>
                                        {priority?.priorityContent}
                                    </div>
                                    <button 
                                        className="trash-button" 
                                        onClick={() => {
                                            priorities.splice(index, 1);
                                            setPriorities([]);
                                        }}
                                        title="remove">
                                        <FontAwesomeIcon icon={ faTrash } />
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
                            // setToDos([...todos, active]);
                            // localStorage.setItem('priorities', JSON.stringify([...todos, active]));
                            // setActive(defaultTask);
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
