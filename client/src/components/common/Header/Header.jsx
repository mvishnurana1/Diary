import { NavLink, useLocation } from "react-router-dom";
import React from 'react';
import './Header.scss';

export function Header() {
    const location = useLocation();

    return (
        <div className="header-container layout">
            <div className="navlinks-group">
                <NavLink 
                    className={
                        location.pathname === '/new' ? 'selected nav-item' : 'nav-item'
                    }
                    to="new">
                    New
                </NavLink>
                <NavLink 
                    className={
                        location.pathname === '/preferences' ? 'selected nav-item' : 'nav-item'
                    }
                    to="preferences">
                    Preferences
                </NavLink>
                <NavLink 
                    className={
                        location.pathname === '/stats' ? 'selected nav-item' : 'nav-item'
                    }
                    to="stats">
                    Stats
                </NavLink>
            </div>

            <div className="logout-btn-container">
                <button 
                    className='logout button'
                    onClick={() => {
                        window.localStorage.removeItem("accessToken");
                        window.localStorage.removeItem("user-verified");
                    }}
                    >Log out</button>
            </div>
        </div>
    )
}
 