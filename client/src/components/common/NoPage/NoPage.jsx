import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import './NoPage.scss';

export function NoPage(){
    return (
        <section className='no-page'>
            <div className='icon-container'>
                <h1 className='header'>404 - Page Not Found</h1>
                <FontAwesomeIcon 
                    icon={faFaceFrown} 
                    size="2xl"
                    color='#eb5858'
                />
            </div>
        </section>
    )
}
