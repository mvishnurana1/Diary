import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getMonthTitle } from "../../helper/date-fn";
import { addAnotherPriorityForMonth, fetchPriorityForMonth, removeAnotherPriorityForMonth } from "../../utils/api/monthPriorities";
import { IAddMonthPriorityRequestModel, IMonthPriorityResponseModel, IRemoveMonthPriorityRequestModel } from "../../models/MonthPriority";
import './monthGoal.scss';

interface userInfo {
    userID: string
};

export function MonthGoal(user: userInfo): JSX.Element {
    const [isAdding, setIsAdding] = useState(false);
    const [priorities, setPriorities] = useState<IMonthPriorityResponseModel[]>([]);
    const [active, setActive] = useState("");

    useEffect(() => {
      (async () => {
        try {
            const prioritiesList = await fetchPriorityForMonth('d7c4c5d9-6d5b-4708-3f63-08dab43498f2');
            setPriorities([...prioritiesList]);
        } catch(err: any) {

        }
      })();
    }, []);

    async function addAnotherPriority() {
        try {
            const priorityToAdd: IAddMonthPriorityRequestModel = {
                   content: active,
                   userID: user.userID,
            }
            const priority = await addAnotherPriorityForMonth(priorityToAdd);
            setPriorities([...priorities, ...priority]);
        } catch (err) {

        }
    }

    async function removePriority(priority: IMonthPriorityResponseModel) {
        try {
            const priorityToRemove: IRemoveMonthPriorityRequestModel = {
                id: priority.id,
                userID: user.userID
            }
            const priorities = await removeAnotherPriorityForMonth(priorityToRemove);
            setPriorities([...priorities]);
        } catch (err) {

        }
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
                                        onClick={async () => {
                                            await removePriority(priority);
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
                                        setActive(value);
                                    }}
                            }
                            placeholder="write new task here"
                    />}

                <button 
                    className="logo-button centre" 
                    title="Add"
                    onClick={() => {
                        setIsAdding(!isAdding);

                        const activeContent = active.trim();

                        if (activeContent.length > 0) {
                            addAnotherPriority();
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
