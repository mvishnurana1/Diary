import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getMonthTitle } from "../../helper/date-fn";
import './monthGoal.scss';

const monthlyGoal = [{
    content: 'Item number 1'
}, {
    content: 'x'
}, {
    content: 'some vusavp mnweorivn jkw bijprwdebn v kjdj vbwirebvi eijwv bepq'
}];

type defaultGoal = {
    content: string
    isEditting: boolean,
    index: number
}

const defaultEdit: defaultGoal = {
    content: '',
    isEditting: false,
    index: -1
}

export function MonthGoal(): JSX.Element {
    const [ edit, setEdit ] = useState<defaultGoal>(defaultEdit);
    const [ edittedContent,  setEdittedContent] = useState('');


    function editGoal(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) {
        monthlyGoal.splice(index, 1, { content: edittedContent });
        setEdit({ isEditting: !edit.isEditting, index: index, content: edittedContent });
        setEdittedContent('');
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value  } = e.target;

        setEdittedContent(value);
    }

    return (
    <div className="month-goal">
        <h1 className="title">
            <div>{getMonthTitle()}'s</div> 
            <div className='sub-title'>top priorities</div>
        </h1>
        <div className="goals-group-container">
            {monthlyGoal.map((goal, index) => 
                <div className="flex-gap-row goal-item" key={index}>
                    <div className="flex-gap-row">
                        {edit.isEditting && edit.index === index ? null : <div>
                            <FontAwesomeIcon className="goal-logo" icon={ faBullseye } />
                        </div>}
                        {
                            (edit.isEditting && edit.index === index) 
                            ? <input 
                                className='update-input' 
                                type="text"

                                onChange={e => handleChange(e)}
                              /> 
                            : <div className="content">{goal.content}</div>
                        }
                    </div>
                    <div className="edit-panel">
                        <button 
                            className="edit-button" 
                            title="edit"
                            onClick={(event) => {
                                editGoal(event, index);
                            }}>
                            <FontAwesomeIcon className="goal-edit" icon={ faPen } />
                        </button>
                        <button className="edit-button" title="delete">
                            <FontAwesomeIcon className="goal-delete" icon={ faTrash } />
                        </button>
                    </div>
                </div>
            )}
        </div>
        <hr />
    </div>)
}
