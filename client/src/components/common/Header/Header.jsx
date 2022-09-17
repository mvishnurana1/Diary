import React from 'react';
import { NavLink, useLocation, Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import { useAuth0 } from '@auth0/auth0-react';
import './Header.scss';

export function Header() {
    const { logout, isAuthenticated, user } = useAuth0();
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
            </div>

            <div className="logout-btn-container">
                <Dropdown>
                    <Dropdown.Toggle
                        className='logout'
                        id="dropdown-basic"
                    >
                        <img 
                            alt=""
                            className="user-profile-picture"
                            src={user.picture} 
                            title={user.nickname}
                        />
                        {user.nickname}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item 
                            as={Link} 
                            to="/preferences"
                        >
                            Preferences
                        </Dropdown.Item>
                        
                        <Dropdown.Item 
                            as={Link} 
                            to="/stats"
                        >
                            Statistics
                        </Dropdown.Item>
                        <Dropdown.Item 
                            onClick={() => {
                                window.localStorage.removeItem("accessToken");
                                window.localStorage.removeItem("user-verified");
                                logout({
                                    returnTo: window.location.origin,
                                })
                            }}
                        >
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>)
    )
}
