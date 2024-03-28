import React, { createContext, useContext, useEffect, useState } from 'react';
import { makeRequest } from '../makeRequest';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [userRole, setUserRole] = useState(null); // Initialisation à partir de localStorage
    const [userId, setUserId] = useState(null); // Initialisation à partir de localStorage
    const [userLoc, setUserLoc] = useState(null); // Initialisation à partir de localStorage
    const [userInfo, setUserInfo] = useState(null); 


    const getRole = async (id) => {
        try {
            const response = await makeRequest({
                method: 'GET',
                url: `/prestataire-pages/?filters[pro][eq]=${id}?populate=*`,
                authToken: localStorage.getItem('authToken')
            });
            if (response)
                setUserRole("pro");
            localStorage.setItem('role', 'pro');
        } catch (error) {
            if (error.response) {
                setUserRole("user");// Défini en tant qu'utilisateur si erreur 401
                localStorage.setItem('role', 'user');
            }
        }
    };



    const login = async (email, password) => {
        try {
            const response = await makeRequest({
                method: 'POST',
                url: '/loginuser',
                data: { 
                    email: email,
                    password: password,
                },
            });
            const data = response.data;
            
            console.log(data);

                
            if (data.token) {
                setUserRole("user");
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userId', data.user.id);
                console.log(data.user.id)
                setAuthToken(data.token);
                setUserId(data.user.id);
                setUserInfo(data.user);
            } else {
                throw new Error('Échec de la connexion');
                
            }
        } catch (error) {
            try {
                const response = await makeRequest({
                    method: 'POST',
                    url: '/logingarage',
                    data: {
                        email: email,
                        password: password,
                    },
                }); 
                const data = response.data;

                if ( data.token) {
                    setUserRole("pro");
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userId', data.user.id);
                    console.log(data.user.id)
                    setAuthToken(data.token); 
                    setUserInfo(data.user);
                    setUserId(data.user.id);
                }
            }
            catch (error) {
                console.error('Erreur de connexion:', error);
            }
        }
    };



    const register = async (email, password, nom, prenom, adresse, telephone) => {
        try {
            const response = await makeRequest({
                method: 'POST',
                url: '/auth/local/register',
                data: {
                    username: email,
                    email: email,
                    password: password,
                    nom: nom,
                    prenom: prenom,
                    adresse: adresse,
                    telephone: telephone,
                },
            });
            const data = response.data;

            if (data.jwt) {
                localStorage.setItem('authToken', data.token);
                setAuthToken(data.jwt);
                setUserRole("user");// Défini en tant qu'utilisateur si erreur 401
            } else {
                throw new Error("Échec de l'inscription");
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            throw error;
        }
    };

    const verifyToken = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await makeRequest({
                    method: 'GET',
                    url: '/users/me', // Remplacer par l'URL appropriée pour la vérification du token
                    authToken: token,
                });
                const data = response.data;

                console.log(data.id)
                setUserId(data.id);
                setUserLoc(data.adresse);
                getRole(data.id);
            } catch (error) {
                localStorage.removeItem('authToken');
                setAuthToken(null);
                setUserRole(null);
                setUserId(null);
            }
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUserRole(null);
        setUserId(null);
    };


    const isAuthenticated = () => {
        return authToken != null;
    };

    const isRole = () => {
        return userRole != null;
    };

    const getUserLoc = () => {
        return userLoc;
    };

        
    const getUserInfo = () => {
        return userInfo;
    };


    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout, register, isRole, userRole, userId, userInfo, verifyToken, getUserLoc, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);