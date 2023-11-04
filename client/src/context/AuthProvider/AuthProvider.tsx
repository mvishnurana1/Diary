import { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { AuthContext } from './AuthContext';
import { fetchUser } from "../../utils/api";
import Children from "../../models/Types/Children";

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

export function AuthProvider({ children }: Children) {
    const [loggedInUser, setloggedInUser] = useState<userFields>(defaultUser);
    const [hasInit, setInit] = useState(false);

    const {
        getAccessTokenSilently, isAuthenticated, loginWithRedirect,
        getIdTokenClaims, user, logout } = useAuth0();

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                window.localStorage.setItem("accessToken", accessToken);

                const idToken = await getIdTokenClaims();
                if (idToken) {
                    window.localStorage.setItem('idToken', idToken.__raw);
                    window.localStorage.setItem('pic', idToken.picture!);
                }
            }
            catch (err: any) {
                if (!isAuthenticated && (err.error === 'login_required' || err.error === 'consent_required')) {
                    loginWithRedirect();
                }
            }
        })();
    });

    useEffect(() => {
        if (hasInit) return;

        getIdTokenClaims().then(idToken => {
            if (!idToken) return;

            getAccessTokenSilently().then(accessToken => {
                if (!accessToken) return;
                
                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem('idToken', idToken.__raw);

                fetchUser(accessToken, idToken.__raw)
                .then(dbUser => {
                    if (!dbUser) {
                        return;
                    }

                    const x = {
                        ...dbUser, isAuthenticated, logout, user 
                    }

                    setloggedInUser({ ...x });
                })
                .then(() => setInit(true));
            });
        });

        
    }, [getIdTokenClaims, getAccessTokenSilently, hasInit,
        loggedInUser, user, isAuthenticated, logout]);

    return (
        <AuthContext.Provider value={{
            loggedInUser: loggedInUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
