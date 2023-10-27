import { createContext } from "react";
import { LoggedInUser } from "../../models";

const defaultUser: LoggedInUser = {
    email: '',
    userID: '',
    userName: ''
}

const AuthContext = createContext({
    isLoading: Boolean,
    user: defaultUser,
    isAuthenticated: Boolean
});

export default AuthContext;
