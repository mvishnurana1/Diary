import { LogoutOptions, User } from '@auth0/auth0-react';
import Dropdown from 'react-bootstrap/Dropdown';
import './Header.scss';

interface headerProps {
    logout: (options?: LogoutOptions | undefined) => void,
    user: User | undefined
}

export function Header(props: headerProps): JSX.Element {
    const { logout, user } = props;

    if (!props) {
        return <div></div>;
    }

    return (
        <div className="header-container layout">
            <div className="logout-btn-container">
                <Dropdown>
                    <Dropdown.Toggle
                        className='logout'
                        id="dropdown-basic">
                        <img
                            alt="user-google-avatar"
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
