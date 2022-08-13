import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from 'react-router';
import { Notes } from './components/Notes/notes';
import { Login } from './components/Login/login.jsx';
import { Preferences } from './components/Preferences/Preferences';
import { Statistics } from './components/Statistics/Statistics';
import { NoPage }  from './components/common/NoPage/NoPage';
import { Header } from './components/common/Header/Header.jsx';
import './App.css';

function App() {
  const { loginWithPopup, isAuthenticated } = useAuth0();

  const {
    isLoading,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  return (
      <BrowserRouter>
      <Header />
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
