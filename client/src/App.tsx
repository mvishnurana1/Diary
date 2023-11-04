import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from 'react-router';
import { AuthProvider, NotesProvider } from "./context";
import { Notes } from './components/Notes/notes';
import { LandingPage } from './components/LandingPage/landingPage';
import { NoPage } from "./components/common";
import './App.scss';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NotesProvider>
      <Router>
        <Routes>
            <Route path="" element={<LandingPage />} />
            <Route path="new" element={<Notes />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
      </NotesProvider>
    </AuthProvider>
  )
}

export default App;
