import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GaragePage from './pages/GaragePage';
import Connexion from './pages/Connexion';
import Navbar from './components/Navbar'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/index.scss";
import CreationCompte from './pages/CreationCompte';

function App() {
  return (

    <Router>
      <Navbar/>
      <Routes>

        {/* Routes for the front */}
        <Route exact path="/" element={<GaragePage />} />
        <Route exact path="/connexion" element={<Connexion />} />
        <Route exact path="/creercompte" element={<CreationCompte />} />

      </Routes>
    </Router>
  );
}


export default App;
