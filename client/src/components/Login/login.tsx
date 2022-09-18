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
        <input 
          className="input" 
          placeholder="email"
          type="email"
          required 
        />
        
        <input 
          className="input" 
          placeholder="password"
          type="password"
          required 
        />

      <div>
        <button className="button red" onClick={() => loginWithRedirect()}>Log In</button>
        <button className="button purple" onClick={() => loginWithRedirect()}>Sign up</button>
      </div>
      </div>
    </div>
  </div>)
};
