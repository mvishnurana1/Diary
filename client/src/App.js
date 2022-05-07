import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Notes } from './components/Notes/notes';
import './App.css';

function App() {
  const { loginWithPopup, isAuthenticated } = useAuth0();

  return (
    <div>
      {
        isAuthenticated || window.localStorage.getItem("user-verified")
          ? <Notes />
          : <>
              <FontAwesomeIcon icon={faBookOpen} />
              <button onClick={loginWithPopup}>Log in</button>
            </>
      }
    </div>
  );
}

export default App;
