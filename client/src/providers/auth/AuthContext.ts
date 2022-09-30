import React, { createContext } from 'react';
import { LoggedInUser } from '../../models/LoggedInUser';

const defaultUser: LoggedInUser = {
    email: '',
    oauthToken: '',
    userID: '',
    userName: '',
    isAuthenticated: false
};

type IDefaultUser = [
    LoggedInUser, React.Dispatch<React.SetStateAction<LoggedInUser>>
];

// Create's authentication context to be use anywhere in the app
const AuthContext = createContext<IDefaultUser>([defaultUser, () => defaultUser]);

export default AuthContext;
