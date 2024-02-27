import React, { useState, useEffect } from 'react';
import RdvDisp from './RdvDisp';
import { format, isEqual } from 'date-fns';
import { fr } from 'date-fns/locale'; // Importez la locale française
import useFetch from '../hooks/useFetch';


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
        date: new Date(2024, 1, 10),
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
        date: new Date(2024,1,7),
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

const RdvList = ({ typeList, idpers }) => {
    const [listId, setListId] = useState([]);
    const [groupedRdv, setGroupedRdv] = useState([]);

    const { data: rdvsdata, loading: rdvsloading } = useFetch(`/rendezvous`, 'GET', null, true, true);


    useEffect(() => {
        let filteredRdv;

        if (typeList === "client") {
            filteredRdv = rendezVous.filter(rdv => rdv.idClient === idpers);
        } else if (typeList === "nouveaux") {
            filteredRdv = rendezVous.filter(rdv => rdv.confirme === 0);
        } else {
            // Si typeList est null ou non spécifié, afficher tous les rendez-vous
            filteredRdv = rendezVous;
        }

        filteredRdv.sort((a, b) => a.date - b.date);
        const rdvByDate = filteredRdv.reduce((acc, rdv) => {
            const formattedDate = format(rdv.date, 'yyyy-MM-dd');
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(rdv);
            return acc;
        }, {});

        setGroupedRdv(Object.entries(rdvByDate));
    }, [typeList, idpers]); // Dépendance sur typeList et idpers

    let lastDisplayedDate = null; // Variable pour stocker la dernière date affichée

    return (
        <div className='rdvlist'>
            {groupedRdv.map(([date, rdvs]) => (
                <div className='displist' key={date}>
                    <div className="date stickyDate">
                        <span />
                        <p>{format(new Date(date), 'EEEE dd MMMM', { locale: fr })}</p>
                        <span />
                    </div>
                    {rdvs.map(rdv => (
                        <RdvDisp key={rdv.id} type={typeList === "client" ? typeList : "normal"} iopen={typeList === "client"} idrdv={rdv.id} />
                    ))}
                </div>
            ))}
        </div>
    );
};


export default RdvList;