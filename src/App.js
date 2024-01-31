import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GaragePage from './pages/GaragePage';
import "./styles/index.scss";

function App() {
  return (

    <Router>

      <Routes>

        {/* Routes for the front */}
        <Route exact path="/" element={<GaragePage />} />

      </Routes>
    </Router>
  );
}

export default App;
