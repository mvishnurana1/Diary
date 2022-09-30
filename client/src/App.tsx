import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from 'react-router';
import { Notes } from './components/Notes/notes';
import { Login } from './components/Login/login';
import { NoPage }  from './components/common/NoPage/NoPage';
import { Header } from './components/common/Header/Header';
import { NotesProvider } from "./providers/notes/NotesProvider";
import './App.scss';

function App(): JSX.Element {
  return (
      <Router>
        <Header />
        <Routes>
            <Route path="" element={<Login />} />
              <Route 
                element={<Notes />}
                path="new" 
              />
            <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
  )
}

export default App;
