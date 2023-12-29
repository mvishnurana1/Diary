import { useAuth0 } from "@auth0/auth0-react";
import { googleLogo, horse, improve, journal, lightBulb, man } from '../../assets';
import './landingPage.scss';
import './landing-page-animation.scss';

export function LandingPage(): JSX.Element {
    const { loginWithRedirect } = useAuth0();

    return (<section className="login-page-container">
        <div className="main-content">
            <div>
                <img src={man} alt="man" width="400px" />
            </div>
            <div className="heading-text-content">
                <h1 className="header" data-testid="header">Diary</h1>
                <h3 data-testid="text" className="text">Daily journaling helps you reflect on your daily choices and benefits your mental health. </h3>

                <button aria-label="login with Google" className="blue button flex" onClick={() => loginWithRedirect()}>
                    <img className='logo' src={googleLogo} alt="google-logo" />
                    <div>Log In / Sign up</div>
                </button>
            </div>
        </div>
        
        <div className="centre header">
            <h3 className="header">Building A Better You</h3>
        </div>

        <div className="about">
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <img src={journal} alt="journal" width="120px" />
                        <span className="stack-font">Journal Daily</span>
                    </div>
                    <div className="flip-card-back">
                        <p>Journaling daily can offer numerous benefits for personal growth, mental well-being, and overall life satisfaction</p>
                    </div>
                </div>
            </div>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <img src={lightBulb} alt="lightBulb" width="120px" />
                        <span className="stack-font">Reflect On Entries</span>
                    </div>
                    <div className="flip-card-back">
                        <p>Self-reflection is a valuable practice that offers a range of benefits for personal development and overall well-being</p>
                    </div>
                </div>
            </div>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <img src={improve} alt="improve" width="120px" />
                        <span className="stack-font">Build Better Habits</span>
                    </div>
                    <div className="flip-card-back">
                        <p>Habits help streamline your daily activities, making them more efficient and less time-consuming</p>
                    </div>
                </div>
            </div>
            {/* <div className="stack">
                <img src={journal} alt="journal" width="120px" />
                <span className="stack-font">Journal Daily</span>
                <div className="card_back">I am a test</div>
            </div>
            <div className="stack">
                <img src={lightBulb} alt="lightBulb" width="120px" />
                <span className="stack-font">Reflect On Entries</span>
            </div>
            <div className="stack">
                <img src={improve} alt="improve" width="120px" />
                <span className="stack-font">Build Better Habits</span>
            </div> */}
        </div>
        <div className="footer" id="footer">
            <div>
                <img src={horse} alt="horse-icon" width="30px" />
            </div>
            <div>Blue Horse &copy; {new Date().getFullYear()}</div>
        </div>
    </section>)
};
