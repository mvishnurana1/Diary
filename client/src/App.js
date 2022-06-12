import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Notes } from './components/Notes/notes';
import { Login } from './components/Login/login.jsx';
import './App.css';

function App() {
  const { loginWithPopup, isAuthenticated } = useAuth0();

  return (
    <div>
      {
        window.localStorage.getItem("user-verified")
          ? <Notes />
          : <Login />
      }
    </div>
  );
}

export default App;
