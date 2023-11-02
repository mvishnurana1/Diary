import { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AuthContext from '../../../context/AuthProvider/auth/AuthContext';
import './Header.scss';

export function Header(): JSX.Element {
    const { loggedInUser } = useContext(AuthContext);

    if (!loggedInUser) {
        return <></>;
    }

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
                            src={loggedInUser.picture ?? localStorage.getItem('pic')}
                            title={loggedInUser.nickname}
                        />
                        {loggedInUser.nickname}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => {
                                window.localStorage.removeItem('accessToken');
                                window.localStorage.removeItem('email');
                                window.localStorage.removeItem('idToken');
                                window.localStorage.removeItem('photo');
                                window.localStorage.removeItem('todos');

                                loggedInUser.logout({
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
