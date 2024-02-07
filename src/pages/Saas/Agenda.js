import React, { useEffect, useMemo, useState } from 'react';
import Calendrier from '../../components/Calendrier';
import Datepicker from '../../components/Datepicker';
import RdvDisp from '../../components/RdvDisp';
import Leftmenu from '../../components/LeftMenu';
import Hearderpro from '../../components/Hearderpro';
import HorairesForm from '../../components/HorairesForm';
import SousMenuPro from '../../components/Sousmenupro';
import ListFiltre from '../../components/ListFiltre';
import Modal from '../../components/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/Loader';

const Agenda = () => {
    const { userId } = useAuth();
    const [sendSubmit, setSendSubmit] = useState(true);
    const [idDispo, setIdDispo] = useState(true);

    const [dispos, setDispo] = useState([
      
    ]);

    const { data, loading, error } = useFetch(`/horaires/?filters[pro][$eq]=${userId}&populate=*`, 'GET', null, true, sendSubmit);

    useEffect(() => {
        if(data){
            setIdDispo(data[0].id);
            setDispo(data[0].attributes.details);
        } 
        setSendSubmit(false);
    }, [data]);

    const [dates, setDates] = useState({ startDate: null, endDate: null });
    const [activeItem, setActiveItem] = useState('agenda');
    const menuItems = [
        { id: 'agenda', label: 'Agenda' },
        { id: 'dispo', label: 'Disponibilités' },
        // Ajoutez d'autres éléments ici si nécessaire
    ];
    const [rdvFilter, setRdvFilter] = useState('all'); // 'all' ou 'new'
    const filters = [
        { name: 'all', label: 'Tout', active: rdvFilter === 'all' },
        { name: 'new', label: 'Nouveaux', active: rdvFilter === 'new' },
        // Ajoutez plus de filtres ici selon vos besoins
    ];
    const [newdatadispo, setNewdatadispo] = useState(null);
    const [chargementCal, setChargementCal] = useState(true);
    const [newActiveItem, setNewActiveItem] = useState(null);
    const [confirmNeed, setConfirmNeed] = useState(null);

    const[selectedRdv, setSelectedRdv] = useState(1);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        if(path) setActiveItem(path);
    }, [location]);

    const handleSetActiveItem = (newItem) => {
        if(confirmNeed) {
            setNewActiveItem(newItem);
        } else {
            setActiveItem(newItem);
            navigate(`/pro/agenda/${newItem}`); // Utilisation de useNavigate pour changer l'URL
        }
    }

    const handleModal = () => {
        handleSetActiveItem(newActiveItem)
        setNewActiveItem(null);
        setConfirmNeed(null);
    }

    // Fonction pour gérer les nouvelles horaires
    const handleNewHoraires = (nouvellesHoraires) => {
        if (nouvellesHoraires) {

            setNewdatadispo(nouvellesHoraires);
        }
        else {
            console.log("oui2")
            setNewdatadispo([{ id: 0, jour: '0', debut: '0', fin: '0', periode: '0' }]);
        }
    };

    useEffect(() => {
        console.log(newdatadispo)
    }, [newdatadispo]);


    const handleDateChange = (start, end) => {

        if (start && end) {
            setDates({ startDate: start, endDate: end });
            setChargementCal(true);
        }
        // Ici, convertissez start et end en tableau de jours si nécessaire
    };



    const rdvs = [
        {
            id: 1,
            idClient: 3,
            idcoiffeur: 19,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 8, 23),
            debut: '15:00',
            fin: '19:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [102, 104, 103],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 1
        },
        {
            id: 2,
            idClient: 2,
            idcoiffeur: 11,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 5, 9),
            debut: '9:00',
            fin: '19:30',
            prenom: 'Bob',
            nomFamille: 'Martin',
            id_prestation: [105],
            adresse: '456 Avenue de la Republique, 75011 Paris',
            email: 'bob.martin@example.com',
            numero: '07 23 45 67 89',
            confirme: 1
        },
        {
            id: 3,
            idClient: 3,
            idcoiffeur: 3,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 3, 8),
            debut: '17:00',
            fin: '18:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [104, 103],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 1
        },
        {
            id: 4,
            idClient: 3,
            idcoiffeur: 17,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 0, 1),
            debut: '15:00',
            fin: '20:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [104, 101, 102],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 1
        },
        {
            id: 5,
            idClient: 1,
            idcoiffeur: 19,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 9, 25),
            debut: '17:00',
            fin: '20:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [106, 105, 103],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 6,
            idClient: 1,
            idcoiffeur: 12,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 1, 28),
            debut: '9:00',
            fin: '19:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [106, 104, 105],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 7,
            idClient: 3,
            idcoiffeur: 18,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 9, 12),
            debut: '14:00',
            fin: '19:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [104, 105, 102],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 1
        },
        {
            id: 8,
            idClient: 1,
            idcoiffeur: 4,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 2, 14),
            debut: '12:00',
            fin: '18:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [101],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 9,
            idClient: 4,
            idcoiffeur: 5,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 8, 20),
            debut: '8:00',
            fin: '19:30',
            prenom: 'David',
            nomFamille: 'Petit',
            id_prestation: [106, 101, 104],
            adresse: '101 Rue du Bac, 75007 Paris',
            email: 'david.petit@example.com',
            numero: '07 12 34 56 78',
            confirme: 1
        },
        {
            id: 10,
            idClient: 1,
            idcoiffeur: 13,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2023, 11, 24),
            debut: '17:00',
            fin: '20:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [106, 105, 103],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 11,
            idClient: 1,
            idcoiffeur: 15,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 5),
            debut: '10:00',
            fin: '14:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [101, 102],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 12,
            idClient: 4,
            idcoiffeur: 20,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 20),
            debut: '11:00',
            fin: '15:30',
            prenom: 'David',
            nomFamille: 'Petit',
            id_prestation: [103, 104],
            adresse: '101 Rue du Bac, 75007 Paris',
            email: 'david.petit@example.com',
            numero: '07 12 34 56 78',
            confirme: 1
        },
        {
            id: 13,
            idClient: 2,
            idcoiffeur: 18,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 15),
            debut: '9:00',
            fin: '12:30',
            prenom: 'Bob',
            nomFamille: 'Martin',
            id_prestation: [105, 106],
            adresse: '456 Avenue de la Republique, 75011 Paris',
            email: 'bob.martin@example.com',
            numero: '07 23 45 67 89',
            confirme: 1
        },
        {
            id: 14,
            idClient: 3,
            idcoiffeur: 14,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 10),
            debut: '13:00',
            fin: '16:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [101, 103],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 1
        },
        {
            id: 15,
            idClient: 1,
            idcoiffeur: 16,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 22),
            debut: '14:00',
            fin: '17:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [102, 104],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 0
        },
        {
            id: 16,
            idClient: 2,
            idcoiffeur: 12,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 18),
            debut: '8:00',
            fin: '11:30',
            prenom: 'Bob',
            nomFamille: 'Martin',
            id_prestation: [105, 106],
            adresse: '456 Avenue de la Republique, 75011 Paris',
            email: 'bob.martin@example.com',
            numero: '07 23 45 67 89',
            confirme: 1
        },
        {
            id: 17,
            idClient: 3,
            idcoiffeur: 13,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 24),
            debut: '12:00',
            fin: '15:30',
            prenom: 'Claire',
            nomFamille: 'Bernard',
            id_prestation: [102, 103],
            adresse: '789 Boulevard Saint-Germain, 75007 Paris',
            email: 'claire.bernard@example.com',
            numero: '06 98 76 54 32',
            confirme: 0
        },
        {
            id: 18,
            idClient: 4,
            idcoiffeur: 17,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 29),
            debut: '15:00',
            fin: '18:30',
            prenom: 'David',
            nomFamille: 'Petit',
            id_prestation: [101, 105],
            adresse: '101 Rue du Bac, 75007 Paris',
            email: 'david.petit@example.com',
            numero: '07 12 34 56 78',
            confirme: 1
        },
        {
            id: 19,
            idClient: 1,
            idcoiffeur: 10,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 12),
            debut: '9:00',
            fin: '12:30',
            prenom: 'Alice',
            nomFamille: 'Dupont',
            id_prestation: [103, 104],
            adresse: '123 Rue de Paris, 75001 Paris',
            email: 'alice.dupont@example.com',
            numero: '06 12 34 56 78',
            confirme: 1
        },
        {
            id: 20,
            idClient: 2,
            idcoiffeur: 11,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 3),
            debut: '10:00',
            fin: '13:30',
            prenom: 'Bob',
            nomFamille: 'Martin',
            id_prestation: [102, 106],
            adresse: '456 Avenue de la Republique, 75011 Paris',
            email: 'bob.martin@example.com',
            numero: '07 23 45 67 89',
            confirme: 1
        },
        {
            id: 21,
            idClient: 2,
            idcoiffeur: 12,
            nomcoiffeur: 'Jean coiffure',
            date: new Date(2024, 0, 18),
            debut: '12:00',
            fin: '13:30',
            prenom: 'Bob',
            nomFamille: 'Martin',
            id_prestation: [105, 106],
            adresse: '456 Avenue de la Republique, 75011 Paris',
            email: 'bob.martin@example.com',
            numero: '07 23 45 67 89',
            confirme: 1
        },
    
    ];


    const arrets = [
        { id: 1, date: new Date(2023, 11, 12), debut: '9:00', fin: '10:30' },
        { id: 2, date: new Date(2023, 11, 13), debut: '9:00', fin: '10:30' },
        { id: 3, date: new Date(2023, 10, 14), debut: '9:00', fin: '9:30' },
    ];

    const filteredRdvs = rdvs.filter(rdv => {
        if (rdvFilter === 'new') {
            return rdv.confirme === 0; // Filtrer pour les RDV non confirmés
        }
        return true; // Afficher tous les RDV
    });

    return (
        <div className='page'>
            <Modal active={newActiveItem ? true : false} >
                <div>
                    <h3>Vos modifications n'ont pas été sauvegardées, êtes vous sûre de vouloir abandonner vos changements ?</h3>
                    <div className="btns">
                        <button className="btn-pro scnd" onClick={() => setNewActiveItem(null)} ><p>Rester</p></button>
                        <button className="btn-pro" onClick={handleModal} ><p>Quitter</p></button>
                    </div>
                </div>
            </Modal>
            <Leftmenu />
            <div className='content agenda'>
                <Hearderpro titre="Agenda" />
                <SousMenuPro items={menuItems} activeItem={activeItem} setActiveItem={(e) => confirmNeed ? setNewActiveItem(e) : handleSetActiveItem(e)} />


                {activeItem === 'agenda' && (
                       dispos && dispos[0] ? 
                    <div className='flex-h agen-sec'>
                        <div className='left sep '>
                            <Datepicker className="calendriercheck" onDateChange={handleDateChange} />
                            {/* <span /> */}
                            <RdvDisp type="normal" iopen={true} idrdv={selectedRdv} />
                        </div>
                        <div className='right'>                            
                        {activeItem === 'agenda' && (
                            <ListFiltre filters={filters} titre="Filtrer par:" direct="horizon" setFilter={setRdvFilter} />
                            )}
                            <Calendrier dispos={newdatadispo && activeItem === 'dispo' ? newdatadispo : dispos} rdvs={filteredRdvs} arrets={arrets} chargement={() => setChargementCal(false)} selectedDates={dates} disposdisp={activeItem === 'dispo' ? true : false} selectedRdv={setSelectedRdv} />
                        </div>
                    </div>:
                    <Loader></Loader>
                     
                )}

                {activeItem === 'dispo' && (
                        dispos && dispos[0] ? 
                    <div className='flex-h agen-sec'>
                        <div className='left sep horaires'>
                            <HorairesForm datadispos={newdatadispo && newdatadispo != [{ id: 0, jour: '0', debut: '0', fin: '0', periode: '0' }] ? newdatadispo : dispos} newdispo={handleNewHoraires} idDispo={idDispo} />
                        </div>
                        <div className='right'>
                            <Calendrier dispos={newdatadispo && activeItem === 'dispo' ? newdatadispo : dispos} rdvs={filteredRdvs} arrets={arrets} chargement={() => setChargementCal(false)} selectedDates={dates} disposdisp={activeItem === 'dispo' ? true : false} />
                        </div>
                    </div> :
                    <Loader></Loader>
                     
                )}
            </div>


        </div>
    );
};



export default Agenda;