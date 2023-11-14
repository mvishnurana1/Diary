import { createContext } from "react";

type userFields = {
    userID: string,
    userName: string,
    email: string,
    nickname: string,
    picture: string,
    isAuthenticated: boolean,
    logout: ({ ...params }: { [x: string]: any; }) => void
}

const defaultUser: userFields = {
    userID: '',
    userName: '',
    email: '',
    nickname: '',
    picture: '',
    isAuthenticated: false,
    logout: ({ ...params }: { [x: string]: any; }) => {},
}

export const AuthContext = createContext({
    loggedInUser: defaultUser,
    authError: false,
    loading: false,
});
