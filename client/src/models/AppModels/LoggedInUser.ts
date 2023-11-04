interface LoggedInUser {
    email: string,
    userID: string
    userName: string,
    picture: string,
    nickname: string,
    isAuthenticated: boolean,
    logout: ({...params}) => void
}

export { type LoggedInUser };
