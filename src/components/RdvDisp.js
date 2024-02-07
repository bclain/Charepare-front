import React, { useState, useEffect } from 'react';
import fr from 'date-fns/locale/fr';
import { registerLocale } from 'react-datepicker';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Facture from './Facture';
registerLocale('fr', fr);


    const rendezVous = [
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

const RdvDisp = ({ type, iopen, idrdv }) => {

    let className = "rdvdisp " + type;
    const [open, setOpen] = useState(iopen);
    const [rdv, setRdv] = useState(null);
    const [termin, setTermin] = useState(false);
    const [prestationsDuRdv, setPrestationsDuRdv] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Créer une nouvelle instance de Date pour la date actuelle
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour la comparaison de date uniquement

    useEffect(() => {
        const nouvRdv = rendezVous.find(rdv => rdv.id === idrdv);
        if (nouvRdv) {
            const rdvDate = nouvRdv.date;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (rdvDate < today) {
                className += " termin";
                setTermin(true);
                // Changer le statut à confirmé
                nouvRdv.confirme = 1;
            }
            else {

                setTermin(false);

                switch (type) {
                    case 'normal':
                        break;
                    case 'actif':
                        className += " actif";
                        break;
                    case 'client':
                        className += " client";
                        break;
                    default:
                        break;
                }
            }
            const prestationsFiltered = prestationsCoiffeur.filter(prestation =>
                nouvRdv.id_prestation.includes(prestation.id_prestation)
            );
            setPrestationsDuRdv(prestationsFiltered);
            setRdv(nouvRdv);
        }
    }, [idrdv]);


    return (
        <div className={rdv && rdv.confirme ? className : className + " aconfirm"}>
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
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.704102 2.21739L1.17013 2.68341L1.16972 2.68382L2.67712 4.19122L2.67753 4.19081L3.83901 5.35229L3.83901 5.37854L3.85213 5.36542L3.86467 5.37796L3.86467 5.35288L5.09301 4.12454L5.1026 4.11495L5.10271 4.11506L5.74567 3.47209L5.74567 3.47188L6.53399 2.68355L6.53379 2.68336L6.99961 2.21754L6.99961 0.621478L5.55861 2.06247L5.55881 2.06267L5.09301 2.52847L5.09301 2.52869L4.48206 3.13963L4.48196 3.13952L3.85213 3.76935L3.22165 3.13887L3.22125 3.13928L2.14473 2.06276L2.14514 2.06236L0.704102 0.621321L0.704102 2.21739Z" fill="#006963" />
                                    </svg>

                                </button>
                            </div>
                            <div className='infos'>
                                <div className='name'>
                                    <div className='grp clientn'>
                                        <p className='desc'>Prénom:</p>
                                        <p>{rdv.prenom}</p>
                                    </div>
                                    <span className='verti'></span>
                                    <div className='grp clientn '>
                                        <p className='desc'>Nom:</p>
                                        <p>{rdv.nomFamille}</p>
                                    </div>
                                    <div className='grp presta'>
                                        <p className='desc'>Prestataire:</p>
                                        <a className='btn-base'><p>{rdv.nomcoiffeur}</p></a>
                                    </div>
                                </div>
                                {prestationsDuRdv && prestationsDuRdv.map(prestation => (

                                    <div key={prestation.id_prestation} className="prestar">
                                        <p>{prestation.titre}</p>
                                        <p className='strong'>{prestation.prix}</p>

                                    </div>
                                ))}
                                <span className='op clientn' />
                                <div className='grp op clientn'>
                                    <p className='desc'>Adresse:</p>
                                    <p className='strong'>{rdv.adresse}</p>
                                </div>
                                <span className='op clientn' />
                                <div className='grp op clientn'>
                                    <p className='desc'>Email:</p>
                                    <p className='strong'>{rdv.email}</p>
                                </div>
                                <div className='grp op clientn'>
                                    <p className='desc'>Téléphone:</p>
                                    <p className='strong'>{rdv.numero}</p>
                                </div>
                            </div>
                            {!termin ?
                                <div className="actions">
                                    <a href="confirm" className='btn-base danger'> <p>Annuler</p> </a>
                                    {rdv.confirme ?
                                        null
                                        : <a href="confirm" className='btn-simple'> <p>Confirmer</p> </a>
                                    }
                                </div>
                                :

                                <div className="actions">

                                    <div>
                                        {rdv.id &&
                                            <Link className='btn-base' to={`/pro/facture/${rdv.id}`}><p>Voir la Facture</p></Link>
                                        }
                                    </div>
                                </div>
                            }

                        </div> </div>
                )
            }
        </div>

    );
};

export default RdvDisp;