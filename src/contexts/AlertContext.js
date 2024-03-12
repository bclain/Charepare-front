import React, { createContext, useContext, useState } from 'react';


const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertContent, setAlertContent] = useState('Une erreur s\'est produite. Veuillez réessayer plus tard.');
    const [alertType, setAlertType] = useState(false);

    const openAlert = (content) => {
        setAlertContent(content);
        setIsAlertOpen(true);
    };

    const closeAlert = () => setIsAlertOpen(false);

    const setTypeAlert = (type) => setAlertType(type);

    

    return (
        <AlertContext.Provider value={{ isAlertOpen, alertContent, openAlert, closeAlert, alertType }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);