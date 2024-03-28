import React, { useState, useEffect } from 'react';
import fr from 'date-fns/locale/fr';
import { registerLocale } from 'react-datepicker';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Facture from './Facture';
import { format, parseISO, set } from 'date-fns';
import { useModal } from '../contexts/ModalContext';
registerLocale('fr', fr);



const prestationsCoiffeur = [
    {
        id_prestation: 101,
        titre: "Coupe Homme",
        temps: "30 minutes",
        prix: "25€"
    },
    {
        id_prestation: 102,
        titre: "Coupe Femme",
        temps: "45 minutes",
        prix: "40€"
    },
    {
        id_prestation: 103,
        titre: "Coloration",
        temps: "90 minutes",
        prix: "60€"
    },
    {
        id_prestation: 104,
        titre: "Balayage",
        temps: "120 minutes",
        prix: "80€"
    },
    {
        id_prestation: 105,
        titre: "Shampooing et brushing",
        temps: "30 minutes",
        prix: "20€"
    },
    {
        id_prestation: 106,
        titre: "Soin capillaire profond",
        temps: "60 minutes",
        prix: "50€"
    },
    // autres prestations...
];

const RdvDisp = ({ type, iopen, idrdv, bRdv }) => {
    const [sendSubmitRdv, setSendSubmitRdv] = useState(false);
    const terminbody = [{id_Statut : 4}];
    const [sendConfirm, setSendConfirm] = useState(false);
    const [sendAnnul, setSendAnnul] = useState(false);
    const [sendNotif, setSendNotif] = useState(false);
    const [sendTermin, setSendTermin] = useState(false);
    const { data: rdvsdata, loading: rdvsloading, error } = useFetch(`/rendezvous/${idrdv}`, 'GET', null, true, sendSubmitRdv);
    const { data: nConfirm, loading: lConfirm, error: eComfirm } = useFetch(`/rendezvous/confirmer/${idrdv}`, 'PATCH', null, true, sendConfirm);
    const { data: nTermin, loading: lTermin, error: eTermin } = useFetch(`/rendezvous/update/${idrdv}`, 'PATCH', terminbody , true, sendTermin);
    const { data: nNotify, loading: lNotify, error: eNotify } = useFetch(`/rendezvous/${idrdv}`, 'PATCH', terminbody , true, sendNotif);
    const { data: nAnnul, loading: lAnnul, error: eAnnul } = useFetch(`/rendezvous/${idrdv}`, 'delete', terminbody , true, sendAnnul);
    
    const { openModalWrdv, reload, modalnContent } = useModal();

    let className = "rdvdisp " + type;

    const [open, setOpen] = useState(iopen);
    const [rdv, setRdv] = useState(null);
    const [etat, setEtat] = useState("");
    const [prestationsDuRdv, setPrestationsDuRdv] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Créer une nouvelle instance de Date pour la date actuelle
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison de date uniquement


    useEffect(() => {
        if (idrdv) {
            setSendSubmitRdv(true);
        }
        if (bRdv) {
            console.log("bRdv", bRdv);
            setRdv(bRdv);
        }
    }, [idrdv, bRdv]);

    useEffect(() => {
        if (!modalnContent) return;
        console.log("modalnContent", modalnContent);
        const { id, action } = modalnContent;
        if (action === 'confirm' && rdv && id === rdv.id) {
            setEtat('confirm')
        }
        else if (action === 'termine' && rdv && id === rdv.id) {
            setEtat('Terminé')
        }
    }, [modalnContent]);

    useEffect(() => {

        if ( nTermin ) {
            reload(idrdv, 'termine');
        }
        if (nConfirm ) {
            reload(idrdv, 'confirm');
        }
        if(nAnnul){
            reload(idrdv, 'cancel');
        }
    }, [nConfirm, nTermin, nAnnul]);

    useEffect(() => {
        if (rdvsdata && rdvsdata.data && rdvsdata.data.dateHeureDebut) {
            console.log("rdvData", rdvsdata.data.dateHeureDebut);
            const debut = parseISO(rdvsdata.data.dateHeureDebut);
            const fin = parseISO(rdvsdata.data.dateHeureFin);
            // Adaptez cette partie en fonction de la structure de vos données
            const rdvData = {
                ...rdvsdata.data,
                voiture: rdvsdata.data.voiture,
                id: rdvsdata.data.id,
                debut: format(parseISO(rdvsdata.data.dateHeureDebut), 'HH:mm', { locale: fr }),
                fin: format(parseISO(rdvsdata.data.dateHeureFin), 'HH:mm', { locale: fr }),
                dateForm: format(parseISO(rdvsdata.data.dateHeureDebut), 'dd/MM/yyyy', { locale: fr }),
            };
            if (rdvsdata.data.id_Statut == 1) {
                setEtat("confirm");
            }
            else if (rdvsdata.data.id_Statut == 2) {
                setEtat("aconfirmer");
            }
            else if (rdvsdata.data.id_Statut == 3) {
                setEtat("En cours");
            }
            else if (rdvsdata.data.id_Statut == 4) {
                setEtat("Terminé");
            }
            console.log("rdvData", rdvData);
            setRdv(rdvData);// Vous pouvez passer des informations supplémentaires si nécessaire
            let servicesObj = JSON.parse(rdvsdata.data.services);
            setPrestationsDuRdv(servicesObj);
            setSendSubmitRdv(false);
        }

    }, [rdvsdata]);

    return (
        <div className={rdv && etat != "aconfirmer" ? className : className + " aconfirm"}>
            {rdv && rdv.id != idrdv ?
                <div>
                    <p className='nouv'></p>
                    <div className={open ? "contentr open" : "contentr"}>
                        <div className='justify'>
                            <div className='loading'>
                                <span />
                            </div>
                            <button className='btn-base details' onClick={() => open ? setOpen(false) : setOpen(true)} ><p>Détails</p>
                                <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.704102 2.21739L1.17013 2.68341L1.16972 2.68382L2.67712 4.19122L2.67753 4.19081L3.83901 5.35229L3.83901 5.37854L3.85213 5.36542L3.86467 5.37796L3.86467 5.35288L5.09301 4.12454L5.1026 4.11495L5.10271 4.11506L5.74567 3.47209L5.74567 3.47188L6.53399 2.68355L6.53379 2.68336L6.99961 2.21754L6.99961 0.621478L5.55861 2.06247L5.55881 2.06267L5.09301 2.52847L5.09301 2.52869L4.48206 3.13963L4.48196 3.13952L3.85213 3.76935L3.22165 3.13887L3.22125 3.13928L2.14473 2.06276L2.14514 2.06236L0.704102 0.621321L0.704102 2.21739Z" fill="#006963" />
                                </svg>

                            </button>
                        </div>
                        <div className='infos'>
                            <div className='name'>
                                <div className='grp clientn'>
                                    <p className='desc'>Prénom:</p>
                                    <div className='loading'>
                                        <span />
                                    </div>
                                </div>
                                <span className='verti'></span>
                                <div className='grp clientn '>
                                    <p className='desc'>Nom:</p>
                                    <div className='loading'>
                                        <span />
                                    </div>
                                </div>
                                <div className='grp presta'>
                                    <p className='desc'>Prestataire:</p>
                                    <div className='loading'>
                                        <span />
                                    </div>
                                </div>
                            </div>
                            <div className='loading'>
                                <span />
                            </div>
                            <span className='op' />
                            <div className='grp op'>
                                <p className='desc'>Adresse:</p>
                                <div className='loading'>
                                    <span />
                                </div>
                            </div>
                            <span className='op' />
                            <div className='grp op'>
                                <p className='desc'>Email:</p>
                                <div className='loading'>
                                    <span />
                                </div>
                            </div>
                            <div className='grp op'>
                                <p className='desc'>Téléphone:</p>
                                <div className='loading'>
                                    <span />
                                </div>
                            </div>
                        </div>
                        <div className="actions op clientn">
                            <div className='loading'>
                                <span />
                            </div>
                        </div>
                    </div> </div>

                :
                rdv && (
                    <div>
                        <p className='nouv'>{type === 'clientvue' ? 'En attente' : 'Nouveau'}</p>
                        <div className={open ? "contentr open" : "contentr"}>
                            <div className='justify'>
                                <p>  {rdv.debut} - {rdv.fin} / {rdv.id} </p>
                                <button className='btn-base detailsbtn' onClick={() => open ? setOpen(false) : setOpen(true)} ><p>Détails</p>
                                    <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.704102 2.21739L1.17013 2.68341L1.16972 2.68382L2.67712 4.19122L2.67753 4.19081L3.83901 5.35229L3.83901 5.37854L3.85213 5.36542L3.86467 5.37796L3.86467 5.35288L5.09301 4.12454L5.1026 4.11495L5.10271 4.11506L5.74567 3.47209L5.74567 3.47188L6.53399 2.68355L6.53379 2.68336L6.99961 2.21754L6.99961 0.621478L5.55861 2.06247L5.55881 2.06267L5.09301 2.52847L5.09301 2.52869L4.48206 3.13963L4.48196 3.13952L3.85213 3.76935L3.22165 3.13887L3.22125 3.13928L2.14473 2.06276L2.14514 2.06236L0.704102 0.621321L0.704102 2.21739Z" fill="black" />
                                    </svg>

                                </button>
                            </div>
                            <div className='infos'>
                                <div className='name'>
                                    <div className='grp clientn'>
                                        <p className='desc'>Marque:</p>
                                        <p>{rdv.voiture.marque}</p>
                                    </div>
                                    <span className='verti'></span>
                                    <div className='grp clientn '>
                                        <p className='desc'>Voiture:</p>
                                        <p>{rdv.voiture.modele}</p>
                                    </div>
                                    <div className='grp presta'>
                                        <p className='desc'>Prestataire:</p>
                                        <a className='btn-base'><p>{rdv.nomcoiffeur}</p></a>
                                    </div>
                                </div>
                                {prestationsDuRdv && prestationsDuRdv.map(prestation => (

                                    <div key={prestation.id_prestation} className="prestar">
                                        <p>{prestation.titre}</p>
                                        <p className='strong'>{prestation.prix}$</p>

                                    </div>
                                ))}
                                <span className='op clientn' />
                                <div className='grp op clientn'>
                                    <p className='desc'>Adresse:</p>
                                    <p className='strong'>{rdv.voiture.client.adresse}</p>
                                </div>
                                <span className='op clientn' />
                                <div className='grp op clientn'>
                                    <p className='desc'>Email:</p>
                                    <p className='strong'>{rdv.voiture.client.email}</p>
                                </div>
                                <div className='grp op clientn'>
                                    <p className='desc'>Téléphone:</p>
                                    <p className='strong'>{rdv.voiture.client.telephone}</p>
                                </div>
                            </div>
                            { etat === "aconfirmer" &&
                                <div className="actions">
                                    <button className='btn-simple danger' onClick={()=>setSendAnnul(true)}> <p>Annuler</p> </button>
                                    <button className='btn-simple confirrm' onClick={()=>setSendConfirm(true)}> <p>Confirmer</p> </button>
                                </div>}
                            { etat === "confirm" &&
                                <div className="actions">
                                   <button className='btn-simple danger' onClick={()=>setSendAnnul(true)}> <p>Annuler</p> </button>
                                </div>}

                            <div className="actions">

                                <div>
                                     { etat === "Terminé" &&
                                        <Link className='btn-simple' to={`/pro/facture/${rdv.id}`}><p>Voir la Facture</p></Link>
                                    }

                                </div>
                            </div>
                            { etat === "En cours" &&
                                <div className="actionplus">
                                    <button href="tel: {rdv.voiture.client.telephone}" className='btn-simple'> <p>Appeler le client</p> </button>
                                    <button href="confirm" className='btn-simple'> <p>Rendez-vous bientôt terminé</p> </button>
                                    <button href="confirm" className='btn-simple' onClick={()=>setSendConfirm(true)}> <p>Rendez-vous terminé</p> </button>
                                </div>
                            }
                        </div> </div>
                )
            }
        </div>

    );
};

export default RdvDisp;