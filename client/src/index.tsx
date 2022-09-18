import { Auth0Provider } from "@auth0/auth0-react";
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import secrets from './secrets/secrets.json';
import history from './history';
import './index.scss';

const root = ReactDOMClient.createRoot(document.getElementById("root") as Element);

const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

root.render(
  <React.StrictMode>
      <Auth0Provider
        audience={secrets.audience}
        clientId={secrets.clientID}
        domain={secrets.domain}
        onRedirectCallback={onRedirectCallback}
        redirectUri={secrets.redirectUri}
        useRefreshTokens
      >
        
          <App />
      </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
