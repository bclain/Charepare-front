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
import  NotifPage from '../../components/NotifPage';

const Agenda = () => {
    const { userId } = useAuth();
    const [sendSubmit, setSendSubmit] = useState(true);
    const [idDispo, setIdDispo] = useState(true);
    const [sendDate, setSendDate] = useState(false);
    const [dispos, setDispo] = useState([

    ]);

    const [rdvs, setRdvs] = useState([

    ]);

    const { data, loading, error } = useFetch(`/pageGarages/1`, 'Get', null, true, true);

    useEffect(() => {
        if (data) {
            setIdDispo(data.id);
            setDispo(data.horaires);
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

    const [selectedRdv, setSelectedRdv] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        if (path) setActiveItem(path);
    }, [location]);

    const handleSetActiveItem = (newItem) => {
        if (confirmNeed) {
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

    const handleDateChange = (start, end) => {

        if (start && end) {
            setDates({ startDate: start, endDate: end, startIsoDate: start.toISOString(), endIsoDate: end.toISOString() });
            console.log(start.toISOString(), end.toISOString());
            setChargementCal(true);
        }
        // Ici, convertissez start et end en tableau de jours si nécessaire
    };

    const { data: rdvsdata, loading: rdvsloading } = useFetch(`/rendezvous`, 'GET', null, true, sendDate);

    useEffect(() => {
        if (dates.startIsoDate && dates.endIsoDate) {
            // Appel de useFetch ici assure que startIsoDate et endIsoDate sont à jour
            setSendDate(true);
        }
    }, [dates.startIsoDate, dates.endIsoDate]);

    useEffect(() => {
        if (rdvsdata && rdvsdata.data && rdvsdata.data.length > 0) {
            console.log("rdvvvv", rdvsdata);
            // Appel de useFetch ici assure que startIsoDate et endIsoDate sont à jour


            const nrdvs = rdvsdata.data.map((rdv, index) => {
                const dateDebut = new Date(rdv.dateHeureDebut);
                const dateFin = new Date(rdv.dateHeureFin);

                return {
                    id: rdv.id,
                    voiture: `${rdv.voiture.marque} ${rdv.voiture.modele}`, // Concatenate marque and modele with a space in between
                    confirme: rdv.id_Statut != 2 ? true : false, // Les IDs commencent à 1 et s'incrémentent
                    date: new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate()), // Crée une nouvelle Date sans les heures
                    debut: `${dateDebut.getHours()}:${dateDebut.getMinutes().toString().padStart(2, '0')}`, // Format HH:mm pour l'heure de début en heure locale
                    fin: `${dateFin.getHours()}:${dateFin.getMinutes().toString().padStart(2, '0')}`, // Format HH:mm pour l'heure de fin en heure locale
                };
            });
            setRdvs(nrdvs);

        }
        setSendDate(false);
    }, [rdvsdata]);





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

            <NotifPage/>
            <Leftmenu />
            <div className='content agenda'>
                <Hearderpro titre="Agenda" />
                <SousMenuPro items={menuItems} activeItem={activeItem} setActiveItem={(e) => confirmNeed ? setNewActiveItem(e) : handleSetActiveItem(e)} />


                {activeItem === 'agenda' && (
                    dispos && dispos[0] && rdvs ?
                        <div className='flex-h agen-sec'>
                            <div className='left sep '>
                                <Datepicker className="calendriercheck" onDateChange={handleDateChange} />
                                {/* <span /> */}
                                <RdvDisp type="normal" iopen={true} idrdv={selectedRdv} onLoaded={()=>null} onVisible={()=>null} />
                            </div>
                            <div className='right'>
                                {activeItem === 'agenda' && (
                                    <ListFiltre filters={filters} titre="Filtrer par:" direct="horizon" setFilter={setRdvFilter} />
                                )}
                                {!rdvsloading ? 
                                <Calendrier dispos={newdatadispo && activeItem === 'dispo' ? newdatadispo : dispos} rdvs={filteredRdvs} arrets={arrets} chargement={() => setChargementCal(false)} selectedDates={dates} disposdisp={activeItem === 'dispo' ? true : false} selectedRdv={setSelectedRdv} />
                                : <Loader></Loader>}
                                </div>
                        </div> :
                        <Loader></Loader>

                )}

                {activeItem === 'dispo' && (
                    dispos && dispos[0] ?
                        <div className='flex-h agen-sec'>
                            <div className='left sep horaires'>
                                <HorairesForm datadispos={newdatadispo && newdatadispo != [{ id: 0, jour: '0', debut: '0', fin: '0', periode: '0' }] ? newdatadispo : dispos} newdispo={handleNewHoraires} idDispo={idDispo} />
                            </div>
                            <div className='right'>
                                <Calendrier dispos={newdatadispo && activeItem === 'dispo' ? newdatadispo : dispos} rdvs={[]} arrets={[]} chargement={() => setChargementCal(false)} selectedDates={dates} disposdisp={activeItem === 'dispo' ? true : false} />
                            </div>
                        </div> :
                        <Loader></Loader>

                )}
            </div>


        </div>
    );
};



export default Agenda;