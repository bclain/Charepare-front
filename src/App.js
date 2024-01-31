import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GaragePage from './pages/GaragePage';
import Navbar from './components/Navbar'
import "./styles/index.scss";

function App() {
  return (

    <Router>
      <Navbar/>
      <Routes>

        {/* Routes for the front */}
        <Route exact path="/" element={<GaragePage />} />

      </Routes>
    </Router>
  );
}


export default App;
