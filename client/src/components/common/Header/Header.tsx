import { LogoutOptions, User } from '@auth0/auth0-react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState } from 'react';
import './Header.scss';

interface headerProps {
    logout: (options?: LogoutOptions | undefined) => void,
    user: User | undefined
}

export function Header(props: headerProps): JSX.Element {
    const { logout, user } = props;
    const [pic, setPic] = useState('');

    useEffect(() => {
        if (!user?.picture) {
            return;
        }
        setPic(user?.picture);
    }, [user?.picture]);

    return (
        <div className="header-container layout">
            <div className="logout-btn-container">
                <Dropdown>
                    <Dropdown.Toggle
                        className='logout'
                        data-testid="dropdown-basic">
                        <img
                            alt="user-google-avatar"
                            className="logo"
                            src={pic ?? localStorage.getItem('photo')!}
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
                                window.localStorage.removeItem('todos');

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
}
