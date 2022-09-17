import { Auth0Provider } from "@auth0/auth0-react";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import secrets from './secrets/secrets.json';
import history from './history';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

const onRedirectCallback = (appState) => {

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
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
