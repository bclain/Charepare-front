import React, { useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Modal = ({ active, children }) => {



    const { isModalOpen, modalContent, closeModal } = useModal();


    return (

        <div className={active || isModalOpen ? "modal open" : "modal closed"}>
            {active || isModalOpen ?
                <div className='modal-content'>
                    {isModalOpen && (
                        <>
                            {modalContent === 'login' && <LoginForm />}
                            {modalContent === 'register' && <RegisterForm />}
                        </>
                    )}

                    {active && children}
                </div>
                : null}

        </div>
    );
};

export default Modal;

