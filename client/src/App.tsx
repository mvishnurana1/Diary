import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from 'react-router';
import { Notes } from './components/Notes/notes';
import { LandingPage } from './components/LandingPage/landingPage';
import { NoPage }  from './components/common/NoPage/NoPage';
import { NotesProvider } from "./context/notes/NotesProvider";
import './App.scss';

function App(): JSX.Element {
  return (
    <NotesProvider>
      <Router>
        <Routes>
            <Route path="" element={<LandingPage />} />
            <Route path="new" element={<Notes />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </NotesProvider>
  )
}

export default App;
