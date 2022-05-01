import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from './reportWebVitals';
import secrets from './secrets/secrets.json';
import App from './App';
import './index.css';

ReactDOM.render(
  <Auth0Provider
    domain={secrets.domain}
    clientId={secrets.clientID}
    redirectUri='/loggedin'
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
