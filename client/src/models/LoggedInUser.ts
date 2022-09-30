export interface LoggedInUser {
    userID: string,
    userName: string,
    email: string,
    oauthToken: string,
    isAuthenticated: boolean
}
