interface LoggedInUser {
    email: string,
    userID: string
    userName: string,
    picture: string,
    nickname: string,
    logout: ({...params}) => void
}

export { type LoggedInUser };
