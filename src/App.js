import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GaragePage from './pages/GaragePage';
import Connexion from './pages/Connexion';
import Navbar from './components/Navbar';
import Agenda from './pages/Pro/Agenda';
import Activite from './pages/Pro/Activite';
import { AuthProvider } from './contexts/AuthContext';
import { MapsLoadProvider } from './contexts/MapLoadContext';
import { ModalProvider } from './contexts/ModalContext';
import Modal from './components/Modal';
import "./styles/index.scss";
import Accueilpro from  './pages/Pro/Accueilpro'

function App() {
  return (
    <AuthProvider>
      
    <MapsLoadProvider >
      <ModalProvider>
    <Router>
      
    <Modal>
        </Modal>
      <Routes>

        {/* Routes for the front */}
        <Route exact path="/" element={<GaragePage />} />

        {/* <Route exact path="/connexion" element={<Connexion />} />
        <Route exact path="/creercompte" element={<CreationCompte />} /> */}

        <Route exact path="/acceuilpro" element={<Accueilpro/>} />
        <Route exact path="/calendrier" element={<Agenda/>} />
        <Route exact path="/activite" element={<Activite/>} />

      </Routes>
    </Router>
    
    </ModalProvider>
    </MapsLoadProvider>
  </AuthProvider>
  );
}


export default App;
