import React from 'react';
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

export function MonthGoal(): JSX.Element {
    return <div className="month-goal">
        <h1 className="title top">{getMonthTitle()} priorities</h1>
        <div className="goals-group-container">
            {monthlyGoal.map((goal, index) => 
                <div className="flex-gap-row goal-item" key={index}>
                    <div className="flex-gap-row">
                        <div>
                            <FontAwesomeIcon className="goal-logo" icon={ faBullseye } />
                        </div>
                        <div className="content">{goal.content}</div>
                    </div>
                    <div className="edit-panel">
                        <button className="edit-button" title="edit" >
                            <FontAwesomeIcon className="goal-edit" icon={ faPen } />
                        </button>
                        <button className="edit-button" title="delete">
                            <FontAwesomeIcon className="goal-delete" icon={ faTrash } />
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
}
