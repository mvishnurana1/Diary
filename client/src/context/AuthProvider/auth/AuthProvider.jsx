import { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import AuthContext from './AuthContext';
import { fetchUser } from "../../../utils/api";

function AuthProvider({ children }) {
    const [loggedInUser, setloggedInUser] = useState({});
    const [hasInit, setInit] = useState(false);

    const {
        getAccessTokenSilently, isAuthenticated, loginWithRedirect,
        getIdTokenClaims, user, logout} = useAuth0();

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const idToken = await getIdTokenClaims();

                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem('idToken', idToken.__raw);
            }
            catch (err) {
                if (!isAuthenticated && (err.error === 'login_required' || err.error === 'consent_required')) {
                    loginWithRedirect();
                }
            }
        })();
    });

    useEffect(() => {
        if (hasInit) {
            return;
        }

        getIdTokenClaims().then(idToken => {
            if (!idToken) return;

            getAccessTokenSilently().then(accessToken => {
                if (!accessToken) return;
                
                window.localStorage.setItem("accessToken", accessToken);
                window.localStorage.setItem('idToken', idToken.__raw);

                fetchUser(accessToken, idToken.__raw)
                .then(usr => {
                    if (!usr) {
                        return;
                    }
                    setloggedInUser({ ...usr, ...user, isAuthenticated, logout });
                })
                .then(() => setInit(true));
            });
        });

    }, [getIdTokenClaims, getAccessTokenSilently, hasInit, loggedInUser, user]);

    return (
        <AuthContext.Provider value={{
            loggedInUser, setloggedInUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
