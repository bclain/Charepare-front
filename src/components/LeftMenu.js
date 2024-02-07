import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../img/logo.png';
import { useAuth } from '../contexts/AuthContext';

const Leftmenu = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const { isAuthenticated, logout, userRole } = useAuth();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`}>
            <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
            <nav>
                <h3>Espace Pro</h3>
                <ul>
                    <li className={isActive('/pro/accueil') ? 'active' : ''}>
                        <Link to="/pro/accueil" >
                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.7926 7.74299L8.59343 0.237547C8.29026 -0.0791824 7.70793 -0.0791824 7.40476 0.237547L0.205564 7.74299C0.101941 7.85076 0.033923 7.98447 0.00978135 8.12784C-0.0143603 8.27121 0.00641428 8.41807 0.0695792 8.55057C0.197565 8.82152 0.483933 8.99565 0.799898 8.99565H2.39972V14.2495C2.39972 14.4485 2.48399 14.6394 2.63401 14.7802C2.78402 14.9209 2.98748 15 3.19963 15H5.59936C5.81151 15 6.01497 14.9209 6.16498 14.7802C6.315 14.6394 6.39927 14.4485 6.39927 14.2495V11.2473H9.59891V14.2495C9.59891 14.4485 9.68319 14.6394 9.8332 14.7802C9.98322 14.9209 10.1867 15 10.3988 15H12.7986C13.0107 15 13.2142 14.9209 13.3642 14.7802C13.5142 14.6394 13.5985 14.4485 13.5985 14.2495V8.99565H15.1983C15.3532 8.99627 15.505 8.95458 15.6351 8.87567C15.7652 8.79676 15.868 8.68404 15.931 8.55124C15.994 8.41845 16.0145 8.27133 15.9899 8.12781C15.9653 7.98429 15.8968 7.85059 15.7926 7.74299Z"/>
                            </svg>
                            Accueil
                        </Link>
                    </li>
                    <li className={isActive('/pro/agenda') ? 'active' : ''}>
                        <Link to="/pro/agenda/agenda">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <path d="M16 8.5V14.7222C16 15.1937 15.8127 15.6459 15.4793 15.9793C15.1459 16.3127 14.6937 16.5 14.2222 16.5H1.77778C1.30628 16.5 0.854097 16.3127 0.520699 15.9793C0.187301 15.6459 0 15.1937 0 14.7222V8.5H16ZM11.5556 0.5C11.7913 0.5 12.0174 0.59365 12.1841 0.760349C12.3508 0.927048 12.4444 1.15314 12.4444 1.38889V2.27778H14.2222C14.6937 2.27778 15.1459 2.46508 15.4793 2.79848C15.8127 3.13187 16 3.58406 16 4.05556V6.72222H0V4.05556C0 3.58406 0.187301 3.13187 0.520699 2.79848C0.854097 2.46508 1.30628 2.27778 1.77778 2.27778H3.55556V1.38889C3.55556 1.15314 3.64921 0.927048 3.81591 0.760349C3.9826 0.59365 4.2087 0.5 4.44444 0.5C4.68019 0.5 4.90628 0.59365 5.07298 0.760349C5.23968 0.927048 5.33333 1.15314 5.33333 1.38889V2.27778H10.6667V1.38889C10.6667 1.15314 10.7603 0.927048 10.927 0.760349C11.0937 0.59365 11.3198 0.5 11.5556 0.5Z"/>
                            </svg>
                            Agenda</Link>
                    </li>
                    <li className={isActive('/pro/activite') ? 'active' : ''}>
                        <Link to="/pro/activite/prestations">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                <path d="M8 12C8.55 12 9.021 11.804 9.413 11.412C9.805 11.02 10.0007 10.5493 10 10C10 9.45 9.804 8.979 9.412 8.587C9.02 8.195 8.54934 7.99934 8 8C7.45 8 6.979 8.196 6.587 8.588C6.195 8.98 5.99934 9.45067 6 10C6 10.55 6.196 11.021 6.588 11.413C6.98 11.805 7.45067 12.0007 8 12ZM4 16H12V15.425C12 15.025 11.8917 14.6583 11.675 14.325C11.4583 13.9917 11.1583 13.7417 10.775 13.575C10.3417 13.3917 9.89567 13.25 9.437 13.15C8.97834 13.05 8.49934 13 8 13C7.5 13 7.02067 13.05 6.562 13.15C6.10334 13.25 5.65767 13.3917 5.225 13.575C4.84167 13.7417 4.54167 13.9917 4.325 14.325C4.10834 14.6583 4 15.025 4 15.425V16ZM14 20H2C1.45 20 0.979002 19.804 0.587002 19.412C0.195002 19.02 -0.000664969 18.5493 1.69779e-06 18V2C1.69779e-06 1.45 0.196001 0.979002 0.588001 0.587002C0.980001 0.195002 1.45067 -0.000664969 2 1.69779e-06H10L16 6V18C16 18.55 15.804 19.021 15.412 19.413C15.02 19.805 14.5493 20.0007 14 20Z" />
                            </svg>
                            Mon activité</Link>
                    </li>
                    <li className={isActive('/pro/parametres') ? 'active' : ''}>
                        <Link to="/pro/parametres">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2793 0.152C10.9093 -4.47035e-08 10.4393 0 9.50032 0C8.56132 0 8.09132 -4.47035e-08 7.72132 0.152C7.22877 0.354211 6.8367 0.743765 6.63132 1.235C6.53732 1.458 6.50132 1.719 6.48632 2.098C6.47965 2.3726 6.40305 2.64097 6.26376 2.87772C6.12448 3.11447 5.92711 3.31178 5.69032 3.451C5.44906 3.5851 5.17786 3.65615 4.90184 3.65754C4.62582 3.65894 4.35392 3.59065 4.11132 3.459C3.77332 3.281 3.52832 3.183 3.28632 3.151C2.75687 3.08148 2.22139 3.2238 1.79632 3.547C1.47832 3.789 1.24332 4.193 0.774315 5C0.304315 5.807 0.0703155 6.21 0.0173155 6.605C-0.0526845 7.131 0.0913156 7.663 0.417316 8.084C0.565316 8.276 0.774316 8.437 1.09732 8.639C1.57432 8.936 1.88032 9.442 1.88032 10C1.88032 10.558 1.57432 11.064 1.09832 11.36C0.774316 11.563 0.565315 11.724 0.416315 11.916C0.255398 12.1239 0.137285 12.3617 0.0687999 12.6156C0.000314891 12.8694 -0.0171837 13.1343 0.0173155 13.395C0.0703155 13.789 0.304315 14.193 0.774315 15C1.24432 15.807 1.47832 16.21 1.79632 16.453C2.22032 16.776 2.75632 16.918 3.28632 16.849C3.52832 16.817 3.77332 16.719 4.11132 16.541C4.35404 16.4092 4.62613 16.3408 4.90234 16.3422C5.17855 16.3436 5.44994 16.4147 5.69132 16.549C6.17732 16.829 6.46532 17.344 6.48632 17.902C6.50132 18.282 6.53732 18.542 6.63132 18.765C6.83532 19.255 7.22732 19.645 7.72132 19.848C8.09132 20 8.56132 20 9.50032 20C10.4393 20 10.9093 20 11.2793 19.848C11.7719 19.6458 12.1639 19.2562 12.3693 18.765C12.4633 18.542 12.4993 18.282 12.5143 17.902C12.5343 17.344 12.8233 16.828 13.3103 16.549C13.5516 16.4149 13.8228 16.3439 14.0988 16.3425C14.3748 16.3411 14.6467 16.4093 14.8893 16.541C15.2273 16.719 15.4723 16.817 15.7143 16.849C16.2443 16.919 16.7803 16.776 17.2043 16.453C17.5223 16.211 17.7573 15.807 18.2263 15C18.6963 14.193 18.9303 13.79 18.9833 13.395C19.0177 13.1343 19 12.8693 18.9314 12.6155C18.8627 12.3616 18.7444 12.1239 18.5833 11.916C18.4353 11.724 18.2263 11.563 17.9033 11.361C17.4263 11.064 17.1203 10.558 17.1203 10C17.1203 9.442 17.4263 8.936 17.9023 8.64C18.2263 8.437 18.4353 8.276 18.5843 8.084C18.7452 7.87606 18.8633 7.63829 18.9318 7.38443C19.0003 7.13057 19.0178 6.86566 18.9833 6.605C18.9303 6.211 18.6963 5.807 18.2263 5C17.7563 4.193 17.5223 3.79 17.2043 3.547C16.7792 3.2238 16.2438 3.08148 15.7143 3.151C15.4723 3.183 15.2273 3.281 14.8893 3.459C14.6466 3.59083 14.3745 3.65922 14.0983 3.65782C13.8221 3.65642 13.5507 3.58528 13.3093 3.451C13.0727 3.31166 12.8755 3.11429 12.7364 2.87755C12.5973 2.64081 12.5209 2.37251 12.5143 2.098C12.4993 1.718 12.4633 1.458 12.3693 1.235C12.2677 0.991736 12.1191 0.770883 11.9321 0.585058C11.745 0.399233 11.5232 0.252078 11.2793 0.152ZM9.50032 13C11.1703 13 12.5233 11.657 12.5233 10C12.5233 8.343 11.1693 7 9.50032 7C7.83032 7 6.47732 8.343 6.47732 10C6.47732 11.657 7.83132 13 9.50032 13Z" />
                            </svg>
                            Paramètres</Link>
                    </li>
                </ul>
            </nav>
            <img src={Logo} alt="" />
        </div>
    );
}
export default Leftmenu;