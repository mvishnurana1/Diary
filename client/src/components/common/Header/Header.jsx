import { NavLink, useLocation } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import './Header.scss';

export function Header() {
    const { logout, isAuthenticated } = useAuth0();
    const location = useLocation();

    return (
        (isAuthenticated && <div className="header-container layout">
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
                        logout({
                            returnTo: window.location.origin,
                        })
                    }}
                    >Log out</button>
            </div>
        </div>)
    )
}
