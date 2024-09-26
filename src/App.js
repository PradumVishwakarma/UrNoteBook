import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Navbar from './Component/Navbar';
import Home from './Component/Home';
import About from './Component/About';
import NoteState from './context/notes/NoteState';

function App() {
  return (
    <div>
      <NoteState>
        <Router>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/home" />
            <Route element={<About />} path="/about" />
          </Routes>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;
