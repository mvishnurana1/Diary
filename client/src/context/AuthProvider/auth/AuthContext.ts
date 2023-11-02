import { createContext } from "react";
import { LoggedInUser } from "../../../models";

const defaultUser: LoggedInUser = {
    email: '',
    userID: '',
    userName: '',
    picture: '',
    nickname: '',
    logout: ({...params}) => {}
}

const AuthContext = createContext({
    loggedInUser: defaultUser,
    isLoading: Boolean,
    user: defaultUser,
    isAuthenticated: Boolean
});

export default AuthContext;
