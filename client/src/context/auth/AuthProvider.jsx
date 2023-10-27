import { useState } from "react";

const defaultUser = {
    email: '',
    userID: '',
    userName: ''
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(defaultUser);

    return (
        <AuthContext.Provider value={{
            user, setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider };
