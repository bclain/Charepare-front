import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';


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
        confirme: 0
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
        confirme: 0
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
        confirme: 0
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
        confirme: 0
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

const Facture = () => {

    const { idFacture } = useParams();
    const idRdv = parseInt(idFacture);

    const calculerTotal = (idPrestations) => {
        return idPrestations.reduce((total, id) => {
            const prestation = prestationsCoiffeur.find(p => p.id_prestation === id);
            return total + parseFloat(prestation.prix.replace('€', ''));
        }, 0);
    };

    const telechargerPDF = () => {
        const element = document.getElementById('factureid');
        html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save('facture.pdf');
        });
    };

    const handlePrint = () => {
        window.print()
    }


    const [rdvTrouve, setRdvTrouve] = useState(null);

    useEffect(() => {
        const nouvrdvTrouve = rendezVous.find(rdv => rdv.id === idRdv);
        setRdvTrouve(nouvrdvTrouve);
        console.log(idRdv);
    }, [idRdv]);

    return (
        <section id={idRdv} className='facture'>
            <div className='contentfront' id='factureid'>
                {rdvTrouve && (
                    <div className='rdv' id='factureid'>
                        <h2>Facture pour {rdvTrouve.prenom} {rdvTrouve.nomFamille}</h2>
                        <p>Date: {format(rdvTrouve.date, 'dd/MM/yyyy')}</p>
                        <h3>Prestations:</h3>
                        <ul>
                            {rdvTrouve.id_prestation.map(id => {
                                const prestation = prestationsCoiffeur.find(p => p.id_prestation === id);
                                return <li key={id}>{prestation.titre} - {prestation.prix}</li>;
                            })}
                        </ul>
                        <p>Total: {calculerTotal(rdvTrouve.id_prestation)}€</p>
                    </div>
                )}
                <div>
                    <button className="btn-pro" onClick={telechargerPDF}>Télécharger la facture</button>
                </div>
            </div>


        </section>
    );
};

export default Facture;