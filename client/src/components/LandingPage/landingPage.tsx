import { useAuth0 } from "@auth0/auth0-react";
import { googleLogo } from '../../assets';
import './landingPage.scss';

export function LandingPage(): JSX.Element {
    const { loginWithRedirect } = useAuth0();

    return (<section className="login-page-container">
        <div className="main-content">
            <div>
                <h1 className="header" data-testid="header">Diary</h1>
                <h3 data-testid="text" className="text">Daily journaling helps you reflect on your daily choices and benefits your mental health. </h3>
            </div>
            <div>
                <button className="blue button flex" onClick={() => loginWithRedirect()}>
                    <img className='logo' src={googleLogo} alt="google-logo" />
                    <div>Log In / Sign up</div>
                </button>
            </div>
        </div>
        <div className="footer" id="footer">
            <div>Blue Horse &copy; {new Date().getFullYear()}</div>
        </div>
    </section>)
};
