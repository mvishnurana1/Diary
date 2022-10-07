import { useAuth0 } from '@auth0/auth0-react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Header.scss';

export function Header(): JSX.Element {
    const { logout, isAuthenticated, user } = useAuth0();
    
    return (
    <>
        {isAuthenticated && user &&
            <div className="header-container layout">
                <div className="logout-btn-container">
                    <Dropdown>
                        <Dropdown.Toggle
                            className='logout'
                            id="dropdown-basic">
                            <img
                                alt=""
                                className="logo"
                                src={require('../../../assets/user.png')}
                                title={user?.nickname}
                            />
                            {user?.nickname}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={() => {
                                    window.localStorage.removeItem('accessToken');
                                    window.localStorage.removeItem('email');
                                    window.localStorage.removeItem('idToken');
                                    window.localStorage.removeItem('photo');

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
            </div>
        }
    </>)
}
