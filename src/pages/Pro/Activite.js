import React, { useEffect, useState } from 'react';
import Leftmenu from '../../components/LeftMenu';
import Hearderpro from '../../components/Hearderpro';
import SousMenuPro from '../../components/Sousmenupro';
import Prestations from '../../components/Prestations';
import Modal from "../../components/Modal";
import Clients from '../../components/Clients';
import { useNavigate, useLocation } from 'react-router-dom';
import MaPage from '../../components/MaPage';
import { useAuth } from '../../contexts/AuthContext';
import useFetch from '../../hooks/useFetch';

const Activite = () => {
    const { userId } = useAuth();
    const [sendSubmit, setSendSubmit] = useState(true);
    const { data, loading, error } = useFetch(`/prestataire-pages/?filters[Pro][$eq]=${userId}&populate=*`, 'GET', null, true, sendSubmit);
    const [activeItem, setActiveItem] = useState('prestations');
    const [actualData, setActualData] = useState(null);
    const [newActiveItem, setNewActiveItem] = useState(null);
    const [confirmNeed, setConfirmNeed] = useState(null);
    const menuItems = [
        { id: 'prestations', label: 'Prestations' },
        { id: 'clients', label: 'Clients' },
        { id: 'ma-page', label: 'Ma page' },
        { id: 'champ-action', label: "Champ d'action" },
        // Ajoutez d'autres éléments ici si nécessaire
    ];

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        if (path) setActiveItem(path);
    }, [location]);

    useEffect(() => {
        if(data) setActualData(data[0])
        setSendSubmit(false);
    }, [data]);

    const handleSetActiveItem = (newItem) => {
        setActiveItem(newItem);
        navigate(`/pro/activite/${newItem}`); // Utilisation de useNavigate pour changer l'URL
    }


    const handleModal = () => {
        handleSetActiveItem(newActiveItem);
        setNewActiveItem(null);
        setConfirmNeed(null);
    }

    return (
        <div className='page activite'>
            <Modal active={newActiveItem ? true : false} >
                <div className='modalAc'>
                    <h5>Vos modifications n'ont pas été sauvegardées, êtes vous sûre de vouloir abandonner vos changements ?</h5>
                    <div className="btns">
                        <button className="btn-pro scnd" onClick={() => setNewActiveItem(null)} ><p>Rester</p></button>
                        <button className="btn-pro" onClick={handleModal} ><p>Quitter</p></button>
                    </div>
                </div>
            </Modal>
            <Leftmenu />
            <div className='content '>
                <Hearderpro titre="Mon activité" />
                <SousMenuPro items={menuItems}   confirm={(e) => setConfirmNeed(e)} activeItem={activeItem} setActiveItem={(e) => confirmNeed ? setNewActiveItem(e) : handleSetActiveItem(e)} />


                {activeItem === 'prestations' && (
                    <Prestations dataPage={actualData} confirm={(e) => setConfirmNeed(e)} newData={()=>setSendSubmit(true)} />
                )}

                {activeItem === 'clients' && (
                    <Clients />
                )}

                {activeItem === 'ma-page' && (
                    <MaPage userId={userId} dataPage={actualData} newData={()=>setSendSubmit(true) }  confirm={(e) => setConfirmNeed(e)}/>
                )}

            </div>
        </div>
    );
};

export default Activite;