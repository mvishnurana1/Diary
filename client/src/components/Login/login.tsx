import { useAuth0 } from "@auth0/auth0-react";
import './login.scss';

export function Login(): JSX.Element {
  const { loginWithRedirect } = useAuth0();

  return (<section className="login-page-container">
    <div className="main-content">
      <div>
        <h1 className="header">Diary</h1>
        <h3 className="text">Daily journaling helps you reflect on your daily choices and benefits your mental health. </h3>
      </div>
      <div>
        <button className="button blue" onClick={() => loginWithRedirect()}>
          <img className='logo' src={require("../../assets/google-logo.png")} alt="google-logo" />
          <span>Log In / Sign up</span>
        </button>
      </div>
    </div>
    <div className="footer">
      <div>Blue Horse &copy; 2022</div>
    </div>
  </section>)
};
