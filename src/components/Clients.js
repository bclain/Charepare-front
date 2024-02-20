import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { startOfWeek, addDays } from 'date-fns';
import ListFiltre from './ListFiltre';
import 'react-datepicker/dist/react-datepicker.css';
import fr from 'date-fns/locale/fr';
import { format } from 'date-fns';
import RdvList from './RdvList';
registerLocale('fr', fr);

const clients = [
    { ID: 1, Nom: "Dupont", Prenom: "Alice", Signaler: false, Email: "alice.dupont@example.com", Numero: "06 12 34 56 78", Adresse: "123 Rue de Paris, 75001 Paris", DateInscription: "2020-01-15", DerniereFacture: "2023-03-12" },
    { ID: 2, Nom: "Martin", Prenom: "Bob", Signaler: true, Email: "bob.martin@example.com", Numero: "07 23 45 67 89", Adresse: "456 Avenue de la Republique, 75011 Paris", DateInscription: "2021-05-22", DerniereFacture: "2023-01-30" },
    { ID: 3, Nom: "Bernard", Prenom: "Claire", Signaler: false, Email: "claire.bernard@example.com", Numero: "06 98 76 54 32", Adresse: "789 Boulevard Saint-Germain, 75007 Paris", DateInscription: "2019-11-08", DerniereFacture: "2023-02-15" },
    { ID: 4, Nom: "Petit", Prenom: "David", Signaler: true, Email: "david.petit@example.com", Numero: "07 12 34 56 78", Adresse: "101 Rue du Bac, 75007 Paris", DateInscription: "2020-07-19", DerniereFacture: "2023-03-05" },
    { ID: 5, Nom: "Robert", Prenom: "Elise", Signaler: false, Email: "elise.robert@example.com", Numero: "06 87 65 43 21", Adresse: "202 Avenue Victor Hugo, 75116 Paris", DateInscription: "2021-09-13", DerniereFacture: "2023-04-10" },
    { ID: 6, Nom: "Richard", Prenom: "Fabien", Signaler: true, Email: "fabien.richard@example.com", Numero: "07 65 43 21 09", Adresse: "320 Rue Saint-Martin, 75003 Paris", DateInscription: "2020-03-28", DerniereFacture: "2023-04-02" },
    { ID: 7, Nom: "Simon", Prenom: "Giselle", Signaler: false, Email: "giselle.simon@example.com", Numero: "06 54 32 10 98", Adresse: "147 Rue Oberkampf, 75011 Paris", DateInscription: "2019-12-01", DerniereFacture: "2023-02-20" },
    { ID: 8, Nom: "Laurent", Prenom: "Hugo", Signaler: true, Email: "hugo.laurent@example.com", Numero: "07 89 76 54 32", Adresse: "58 Avenue de Wagram, 75017 Paris", DateInscription: "2021-02-17", DerniereFacture: "2023-03-28" },
    { ID: 9, Nom: "Lefebvre", Prenom: "Irene", Signaler: false, Email: "irene.lefebvre@example.com", Numero: "06 21 09 87 65", Adresse: "25 Rue de la Chaussee d'Antin, 75009 Paris", DateInscription: "2022-06-24", DerniereFacture: "2023-01-12" },
    { ID: 10, Nom: "Roux", Prenom: "Jean", Signaler: true, Email: "jean.roux@example.com", Numero: "07 34 56 78 90", Adresse: "88 Rue de Rivoli, 75004 Paris", DateInscription: "2018-08-30", DerniereFacture: "2023-04-18" },
    { ID: 11, Nom: "Vincent", Prenom: "Karine", Signaler: false, Email: "karine.vincent@example.com", Numero: "06 78 90 12 34", Adresse: "60 Rue de la Pompe, 75116 Paris", DateInscription: "2020-10-05", DerniereFacture: "2023-03-22" },
    { ID: 12, Nom: "Fournier", Prenom: "Louis", Signaler: true, Email: "louis.fournier@example.com", Numero: "07 90 12 34 56", Adresse: "33 Rue du Louvre, 75002 Paris", DateInscription: "2019-04-18", DerniereFacture: "2023-02-28" },
    { ID: 13, Nom: "Moreau", Prenom: "Mireille", Signaler: false, Email: "mireille.moreau@example.com", Numero: "06 45 67 89 01", Adresse: "75 Rue de Levis, 75017 Paris", DateInscription: "2021-01-22", DerniereFacture: "2023-01-08" },
    { ID: 14, Nom: "Girard", Prenom: "Nathalie", Signaler: true, Email: "nathalie.girard@example.com", Numero: "07 12 34 56 78", Adresse: "142 Rue de Charonne, 75011 Paris", DateInscription: "2022-05-30", DerniereFacture: "2023-04-06" },
    { ID: 15, Nom: "Perrin", Prenom: "Olivier", Signaler: false, Email: "olivier.perrin@example.com", Numero: "06 23 45 67 89", Adresse: "18 Rue de Belleville, 75020 Paris", DateInscription: "2018-07-15", DerniereFacture: "2023-03-15" },
    { ID: 16, Nom: "Brun", Prenom: "Patricia", Signaler: true, Email: "patricia.brun@example.com", Numero: "07 98 76 54 32", Adresse: "41 Rue de la Roquette, 75011 Paris", DateInscription: "2020-08-09", DerniereFacture: "2023-04-01" },
    { ID: 17, Nom: "Blanchard", Prenom: "Quentin", Signaler: false, Email: "quentin.blanchard@example.com", Numero: "06 87 65 43 21", Adresse: "89 Rue du Faubourg Saint-Antoine, 75011 Paris", DateInscription: "2021-11-11", DerniereFacture: "2023-03-10" },
    { ID: 18, Nom: "Duval", Prenom: "Rachel", Signaler: true, Email: "rachel.duval@example.com", Numero: "07 65 43 21 09", Adresse: "102 Rue de Grenelle, 75007 Paris", DateInscription: "2019-09-05", DerniereFacture: "2023-02-12" },
    { ID: 19, Nom: "Marechal", Prenom: "Sophie", Signaler: false, Email: "sophie.marechal@example.com", Numero: "06 54 32 10 98", Adresse: "56 Rue des Martyrs, 75009 Paris", DateInscription: "2022-03-20", DerniereFacture: "2023-04-20" },
    { ID: 20, Nom: "Leroy", Prenom: "Thierry", Signaler: true, Email: "thierry.leroy@example.com", Numero: "07 34 56 78 90", Adresse: "11 Rue de Montmorency, 75003 Paris", DateInscription: "2020-12-25", DerniereFacture: "2023-03-25" }
];



const Clients = () => {
    const [selectedClient, setSelectedClient] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(new Date());

    const [clientFilter, setClientFilter] = useState('all'); // 'all' ou 'new'
    const [clientSort, setClientSort] = useState('date'); // 'all' ou 'new'

    const filters = [
        { name: 'all', label: 'Tous', active: clientFilter === 'all' },
        { name: 'new', label: 'Nouveaux', active: clientFilter === 'new' },
        { name: 'blocked', label: 'Bloqués', active: clientFilter === 'blocked' },
        // Ajoutez plus de filtres ici selon vos besoins
    ];

    const sort = [
        { name: 'date', label: 'Date', active: clientSort === 'date' },
        { name: 'inscription', label: 'Inscription', active: clientSort === 'inscription' },
        // Ajoutez plus de filtres ici selon vos besoins
    ];

    return (
        <div className='flex-h clients'>
            <div className='left  '>
                <h3>Clients</h3>
                <div className="triseclect form mid">
                    <div class="form-group line">
                        <p>Du</p>
                        <DatePicker className="inputs mid" placeholderText='Selectionnez une date' selected={startDate} onChange={(date) => setStartDate(date)} maxDate={endDate} />
                    </div>
                    <div class="form-group line">
                        <p>Au</p>
                        <DatePicker className="inputs mid" placeholderText='Selectionnez une date' selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
                <ListFiltre filters={sort} titre="Trier par:" direct="verti" setFilter={setClientSort} />
                <ListFiltre filters={filters} titre="Filtrer par:" direct="verti" setFilter={setClientFilter} />

            </div>
            <div className='right'>
                <div className='clientlist'>
                    {clients.map((client) => (
                        <div className={selectedClient == client.ID ? 'client actif' : 'client'} key={client.ID} onClick={() => setSelectedClient(client.ID)}>
                            <p className='nom'>{client.Prenom} {client.Nom}</p> <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 5 8" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.83885 7.14795L2.30487 6.68192L2.30528 6.68233L3.81268 5.17493L3.81215 5.1744L4.97351 4.01304L5 4.01304L4.98675 3.9998L4.99915 3.9874L4.97436 3.9874L3.746 2.75904L3.73641 2.74945L3.73652 2.74934L3.09355 2.10638L3.09334 2.10638L2.30501 1.31806L2.30482 1.31825L1.839 0.852443L0.242937 0.852443L1.68393 2.29344L1.68413 2.29324L2.14993 2.75904L2.15015 2.75904L2.76109 3.36999L2.76098 3.37009L3.39069 3.9998L2.76007 4.63042L2.7606 4.63095L1.68422 5.70732L1.68382 5.70691L0.24278 7.14795L1.83885 7.14795Z" fill="#006963" />
                            </svg>
                        </div>
                    ))}
                </div>
                <div className="details">
                    <div className="ca">
                        <h3>Total généré: </h3>
                        {startDate && endDate &&
                            <div className='grp'> <p>Du </p> <p>{format(startDate, 'dd/MM/yyyy')}</p> <p> au </p> <p>{format(endDate, 'dd/MM/yyyy')}</p>  </div>
                        }
                        <p className='can'>360 €</p>
                    </div>

                    <h4>Selectionné</h4>
                    {selectedClient && (<div className="clientdet">
                        <div className='info'>
                            {/* Ici, vous allez afficher les informations du client trouvé */}
                            {/* Par exemple, pour le nom: */}
                            <div className='grp'>
                                <p className='desc'>Nom:</p>
                                <p className='strong'>{clients.find(client => client.ID === selectedClient).Prenom} {clients.find(client => client.ID === selectedClient).Nom}</p>
                            </div>
                            {/* Vous répétez ce processus pour les autres informations du client */}
                            <div className='grp'>
                                <p className='desc'>Adresse:</p>
                                <p className='strong'>{clients.find(client => client.ID === selectedClient).Adresse}</p>
                            </div>
                        </div>
                        <RdvList typeList={"client"} idpers={selectedClient}></RdvList>
                    </div>)
                    }

                </div>
            </div>

        </div>
    );
};

export default Clients;