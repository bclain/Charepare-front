import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RoutePro = ({ children }) => {
    const { isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        console.log(userRole)
        // Redirection si l'utilisateur n'est pas authentifié ou si son rôle n'est pas 'pro'
        if (!isAuthenticated() || userRole !== 'pro') {
            // Rediriger vers l'accueil
            // Note : Vous devrez peut-être ajuster cette partie pour qu'elle fonctionne dans votre environnement de routage
            window.location.href = '/'; 
        }
        console.log()
    }, [isAuthenticated, userRole]); // Dépendances de useEffect

    // Si l'utilisateur est authentifié et a le rôle 'pro', afficher les enfants
    return isAuthenticated() && userRole && userRole === 'pro' ? children : null;
};

export default RoutePro;