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
        const content = monthlyGoal[index].content;
        monthlyGoal.splice(0, 1, { content: edittedContent });
        setEdit({ isEditting: !edit.isEditting, index: index, content: edittedContent });
        setEdittedContent('');
    }

    return (
    <div className="month-goal">
        <h1 className="title top">{getMonthTitle()} priorities</h1>
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
                                onChange={e => setEdittedContent(e.target.value)}
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
                                // monthlyGoal.splice();
                                // setEdit({ content: monthlyGoal[index].content, index, isEditting: !edit.isEditting }); 
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
    </div>)
}
