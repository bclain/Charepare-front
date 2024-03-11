import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rdvForModal, setRdvForModal] = useState(null);
    const [modalContent, setModalContent] = useState('login');
    const [modalnContent, setModalnContent] = useState(false);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const openModalWrdv = (content, rdv) => {
        setModalContent(content);
        setIsModalOpen(true);
        setRdvForModal(rdv);
    };

    const closeModal = () => setIsModalOpen(false) && setRdvForModal(null);

    const reload = (id, action) => {setModalnContent({id, action}) && console.log('false relaoidddd')} ;

    return (
        <ModalContext.Provider value={{ isModalOpen, modalContent, rdvForModal,modalnContent, openModal, closeModal, openModalWrdv, reload }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);