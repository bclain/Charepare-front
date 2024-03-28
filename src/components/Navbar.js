import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';
import Alert from './Alert';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const { openModal, closeModal } = useModal();
    const { isAuthenticated, logout, userRole } = useAuth();

    useEffect(() => {
        console.log(isAuthenticated());
        if (isAuthenticated()) {
            closeModal();
        }
        console.log(userRole);

    }, [userRole, closeModal]);

    const handleOpenLogin = () => {
        openModal('login');
    };

    const handleOpenRegister = () => {
        openModal('register');
    };

    const handleOpenRegisterPro = () => {
        openModal('registerpro');
    };
    return (
        <div class="header">
            <nav class="content">
                <a class="logo" href="#">
                    <img src={logo}></img>
                </a>
                {
                    !isAuthenticated() ? (
                        <div className='btns'>
                            <button onClick={handleOpenRegister} className='btn-base'>
                                <p>Inscription</p>
                                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.57249 11.4584L4.34049 10.6272L4.34051 10.6273L6.71742 8.05501L6.71709 8.05502L8.74258 5.86307L8.78719 5.86131L8.764 5.83989L8.78577 5.81633L8.74044 5.81812L6.54897 3.79306L6.54901 3.79306L4.29305 1.70842L4.29321 1.70825L3.14557 0.647763L0.404775 0.755939L2.64338 2.82454L2.64298 2.82456L5.2151 5.20136L5.21512 5.20134L6.02321 5.94806L4.98424 7.07242L4.98429 7.07247L2.89984 9.32822L2.90004 9.32821L0.831698 11.5665L3.57249 11.4584Z" fill="black" />
                                </svg>
                            </button>
                            <button onClick={handleOpenLogin} className='btn-simple'>
                                <p>Connexion</p>
                            </button>
                        </div>
                    )
                        :
                        <div className='btns'>
                            <button onClick={logout} className='btn-base'>
                                <p>Deconnection</p>
                            </button>
                        </div>
                }

            </nav>
        </div>
    );
};

export default Navbar;