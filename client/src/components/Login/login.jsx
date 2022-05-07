import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import './login.scss';

export function Login() {
  const { loginWithRedirect } = useAuth0();

  return (<div className="login-page-container">
    <div className="main-content">
      <div className="content">
        <h1 className="header">Diary</h1>
        <h2 className="text">Daily journaling helps you reflect on your daily choices and benefits your mental health. </h2>
      </div>
      <div>
        <button className="button red" onClick={() => loginWithRedirect()}>Log In / Sign up</button>
      </div>
    </div>
  </div>)
};
