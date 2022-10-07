import { useAuth0 } from "@auth0/auth0-react";
import './login.scss';

export function Login(): JSX.Element {
  const { loginWithRedirect } = useAuth0();

  return (<div className="login-page-container">
    <div className="main-content">
      <div className="content">
        <h1 className="header">Diary</h1>
        <h3 className="text">Daily journaling helps you reflect on your daily choices and benefits your mental health. </h3>
      </div>
      <div className="form-container">
        <div>
          <button className="button blue" onClick={() => loginWithRedirect()}>
            <img className='logo' src={require("../../assets/google-logo.png")} alt="google-logo" />
            <span>Log In / Sign up</span>
          </button>
        </div>
      </div>
    </div>
  </div>)
};
