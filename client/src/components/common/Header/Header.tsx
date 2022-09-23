import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import './Header.scss';

export function Header(): JSX.Element {
    const { logout, isAuthenticated, user } = useAuth0();
    const img = localStorage.getItem('photo')!;

    useEffect(() => {}, [])
    useEffect(() => {
    const img = localStorage.getItem('photo')!;
    }, [user]);

    return (<>
        {isAuthenticated && 
            <div className="header-container layout">
                <div className="logout-btn-container">
                    <Dropdown>
                        <Dropdown.Toggle
                            className='logout'
                            id="dropdown-basic"
                        >
                            {user && user?.picture && <img 
                                alt=""
                                className="user-profile-picture"
                                src={user?.picture! ?? img}
                                title={user?.nickname}
                            />}
                            {user?.nickname}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={() => {
                                    localStorage.removeItem('accessToken');
                                    localStorage.removeItem('photo');
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
