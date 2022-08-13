import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Notes } from './components/Notes/notes';
import { Login } from './components/Login/login.jsx';
import { Preferences } from './components/Preferences/Preferences';
  import { Statistics } from './components/Statistics/Statistics';
import { NoPage }  from './components/common/NoPage/NoPage';
import './App.css';

function App() {
  const { loginWithPopup, isAuthenticated } = useAuth0();

  return (
    <BrowserRouter>
      <Routes>
          <Route path="" element={<Login />} />
          <Route path="new" element={<Notes />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
