import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Hearderpro = ({ titre }) => {
    const { isAuthenticated, logout, userRole } = useAuth();

    return (
        <div className='headerpro' >
            <p className='titre' >{titre}</p>
            <div className='notifs nouv'>
                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                <path d="M9.46081 13.943C9.46094 14.3568 9.30992 14.7554 9.03803 15.0589C8.76614 15.3623 8.39347 15.5482 7.99474 15.5792L7.87587 15.5833H6.29092C5.89105 15.5835 5.50592 15.4272 5.21272 15.1458C4.91952 14.8644 4.73992 14.4787 4.70993 14.066L4.70597 13.943H9.46081ZM7.08339 7.82502e-10C8.52172 -2.45602e-05 9.90382 0.578136 10.9382 1.61253C11.9725 2.64691 12.5782 4.05666 12.6275 5.54438L12.6307 5.74123V8.82836L14.0746 11.8171C14.1376 11.9475 14.1691 12.0918 14.1665 12.2375C14.1639 12.3833 14.1271 12.5263 14.0594 12.6541C13.9917 12.782 13.8951 12.891 13.7778 12.9718C13.6605 13.0525 13.526 13.1027 13.3859 13.1179L13.2948 13.1228H0.871979C0.731049 13.1228 0.592209 13.0875 0.467358 13.0199C0.342508 12.9522 0.235368 12.8542 0.155121 12.7343C0.0748732 12.6144 0.0239109 12.4762 0.00660081 12.3314C-0.0107093 12.1867 0.00614895 12.0397 0.0557308 11.9032L0.0921846 11.8171L1.53607 8.82836V5.74123C1.53607 4.21856 2.12052 2.75825 3.16084 1.68157C4.20117 0.604877 5.61215 7.82503e-10 7.08339 7.82502e-10Z" fill="#FF5E00"/>
                </svg>
                <p className='strong' >Nouvelles soumissions</p>
            </div>
            <a className='btn-pro' href="">
                <p> + Nouvel évênement</p>
            </a>
            <button className='btn-base' onClick={logout}>
                <p>Deconnexion</p>
            </button>
        </div>
    );
};

export default Hearderpro;