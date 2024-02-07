import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login,userRole, isAuthenticated } = useAuth();
    const { closeModal } = useModal();
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            // La connexion a réussi
        } catch (error) {
            // Gérer les erreurs de connexion ici
        }
    };
    
    useEffect(() => {
        if (isAuthenticated()) {
            closeModal();
        }
        if (isAuthenticated() && userRole == "pro") {
            navigate(`/pro/accueil`);
        }
    }, [userRole, closeModal]);


    return (
        <form onSubmit={handleSubmit}>
            <h3>Connexion</h3>
            <div className="form-group">

                <label htmlFor="email">Adress email</label>
                <input
                    type="email"
                    className="inputs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
            </div>
            <div className="form-group">

                <label htmlFor="passoworld">Mot de passe</label>
                <input
                    type="password"
                    className="inputs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />
            </div>

            <div className="btns">
                <button className="btn-pro scnd " type='button' onClick={closeModal}> <p>Retour</p></button>
                <button className='btn-pro' type="submit"><p>Se connecter</p></button>

            </div>

        </form>
    );
};

export default LoginForm;