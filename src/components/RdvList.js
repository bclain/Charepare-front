import React, { useState, useEffect, useRef } from 'react';
import RdvDisp from './RdvDisp';
import { format, parseISO, addDays } from 'date-fns';
import useFetch from '../hooks/useFetch';
import { fr } from 'date-fns/locale';
import { useModal } from '../contexts/ModalContext';


let instanceCounter = 0;

const RdvList = ({ typeList, idpers }) => {

    const { modalnContent } = useModal();

    const today = new Date();
    typeList !== "nouveaux" && today.setDate(today.getDate() - 2);
    const [startDay, setStartDay] = useState(today.toISOString());

    const instanceId = useRef(instanceCounter++).current;
    let url = false
    url = typeList === "nouveaux" ? "confirm=false" : null;

    let load = false;
    const [loadedCount, setLoadedCount] = useState([]); // ou utiliser un Set si vous préférez
    const [dataSend, setDataSend] = useState(true);
    const [groupedRdv, setGroupedRdv] = useState([]);
    const [debutRdv, setDebutRdv] = useState(0);
    const [finRdv, setFinRdv] = useState(0);
    const [sendReload, setSendReload] = useState(false);
    const [dates, setDates] = useState({ startIsoDate: '', endIsoDate: '' });

    const { data: rdvsdata, loading: rdvsloading } = useFetch(`/rendezvous?startDate=${startDay}&lazy=true&${url}`, 'GET', null, true, dataSend);
    const { data: rdvsupdate, loading: rdvupdateoading } = useFetch(`/rendezvous?startDate=${dates.startIsoDate}&endDate=${dates.endIsoDate}`, 'GET', null, true, sendReload);

    useEffect(() => {
        if (!rdvsdata) return; // Si aucune donnée n'est disponible, ne faites rien
        // Aplatir le tableau de tableaux en un seul tableau
        const transformedRdvsData = rdvsdata.map(rdv => ({
            ...rdv, // on conserve toutes les autres propriétés de l'objet rdv sans changement
            date: rdv.dateHeureDebut, // on renomme dateHeureDebut en date
            datefin: rdv.dateHeureFin // on renomme dateHeureFin en datefin
        }));
    
        // Aplatir le tableau de tableaux en un seul tableau (si nécessaire)
        const flattenedRdvs = transformedRdvsData.flat();
        // Conversion de l'état actuel (tableau de paires) en objet pour faciliter la fusion
        const currentRdvByDate = groupedRdv.reduce((acc, [date, rdvs]) => {
            acc[date] = rdvs;
            return acc;
        }, {});
        // Tri des rendez-vous par date
        const sortedRdv = flattenedRdvs.sort((a, b) => parseISO(a.date) - parseISO(b.date));

        // Regroupement des rendez-vous par date avec vérification de l'existence d'un rdv par son id
        sortedRdv.forEach(rdv => {
            const date = format(parseISO(rdv.date), 'yyyy-MM-dd');
            if (!currentRdvByDate[date]) {
                currentRdvByDate[date] = [];
            }

            // Recherche de l'existence de l'rdv par son id dans la liste des rdvs pour la date donnée
            const rdvExists = currentRdvByDate[date].some(existingRdv => existingRdv.id === rdv.id);

            // Si l'rdv n'existe pas déjà, l'ajouter à la liste pour cette date
            if (!rdvExists) {
                currentRdvByDate[date].push(rdv);
            }
        });

        // Convertir l'objet fusionné de retour en tableau pour l'état groupedRdv
        setGroupedRdv(Object.entries(currentRdvByDate));

        setDataSend(false);
        // Mise à jour de l'état avec les rendez-vous regroupés par date;
        // Défilement vers la date d'aujourd'hui après le rendu des éléments
        if (sortedRdv.length > 0) {
            const lastRdvDate = sortedRdv[sortedRdv.length - 1].date;
            setStartDay(lastRdvDate);
            setDates({
                startIsoDate: sortedRdv[0].date,
                endIsoDate: sortedRdv[sortedRdv.length - 1].date // Format ajusté pour la requête
            });
        }
        if (sortedRdv.length > 5) {
            const nfinRdv = sortedRdv[sortedRdv.length - 2].id;
            const ndebutRdv = sortedRdv[2].id;
            setDebutRdv(ndebutRdv);
            setFinRdv(nfinRdv);
            // Mettre à jour l'état ou effectuer d'autres actions en fonction de cet avant-dernier RDV
        }
    }, [rdvsdata]);


    // useEffect(() => {
    //     console.log("reload", modalnContent);

    //     // if (modalnContent === true) {
    //     //     console.log("reload");
    //     //     setSendReload(true);
    //     // }
    // }, [modalnContent]);


useEffect(() => {
    if (!modalnContent) return;

    const { id, action } = modalnContent;

    if (action === 'cancel') {
        setGroupedRdv(current => {
            // D'abord, supprimer le rdv spécifié
            const updatedRdvs = current.map(([date, rdvs]) => [date, rdvs.filter(rdv => rdv.id !== id)]);

            // Ensuite, filtrer pour enlever les intervalles qui sont maintenant vides
            return updatedRdvs.filter(([, rdvs]) => rdvs.length > 0);
        });
    } else if (action === 'confirm' && typeList === "nouveaux") {
        setGroupedRdv(current => {
            // D'abord, supprimer le rdv spécifié
            const updatedRdvs = current.map(([date, rdvs]) => [date, rdvs.filter(rdv => rdv.id !== id)]);

            // Ensuite, filtrer pour enlever les intervalles qui sont maintenant vides
            return updatedRdvs.filter(([, rdvs]) => rdvs.length > 0);
        });
    }
}, [modalnContent]);

    const handleRdvLoad = (id) => {
        setLoadedCount((currentLoaded) => {
            const updatedLoaded = new Set(currentLoaded);
            if (!updatedLoaded.has(id)) {
                updatedLoaded.add(id);
                // Mettre à jour nbRdvs ici si nécessaire, mais cela semble être un compteur global plutôt qu'un par ID chargé
            }
            return updatedLoaded;
        });
    };

    // useEffect(() => {
    //     if (!rdvsupdate) return; // Si aucune mise à jour n'est disponible, ne faites rien

    //     // Convertir l'état actuel (groupedRdv) en une structure facile à manipuler
    //     const currentRdvByDate = groupedRdv.reduce((acc, [date, rdvs]) => {
    //         acc[date] = rdvs.reduce((rdvMap, rdv) => {
    //             rdvMap[rdv.id] = rdv;
    //             return rdvMap;
    //         }, {});
    //         return acc;
    //     }, {});

    //     const updatedRdvs = {}; // Stocker les rdvs mis à jour ou ajoutés
    //     const idsToUpdate = new Set(rdvsupdate.map(rdv => rdv.id)); // Identifiants des rdvs reçus dans la mise à jour

    //     // Éliminer les rdvs qui ne sont plus valides (supprimés ou modifiés)
    //     Object.keys(currentRdvByDate).forEach(date => {
    //         // Assurez-vous que vous travaillez avec un tableau
    //         const rdvsArray = Object.values(currentRdvByDate[date]);

    //         // Filtrer le tableau pour éliminer les rdvs supprimés
    //         const filteredRdvs = rdvsArray.filter(rdv => idsToUpdate.has(rdv.id));

    //         // Ensuite, vous devez reconstruire la structure avec les rdvs mis à jour pour cette date
    //         currentRdvByDate[date] = filteredRdvs.reduce((acc, rdv) => {
    //             acc[rdv.id] = rdv;
    //             return acc;
    //         }, {});

    //         // Incorporer les mises à jour
    //         if (updatedRdvs[date]) {
    //             currentRdvByDate[date] = { ...currentRdvByDate[date], ...updatedRdvs[date] };
    //         }
    //     });

    //     console.log("currentRdvByDate", currentRdvByDate);
    //     const filteredRdvByDate = Object.entries(currentRdvByDate)
    //         .filter(([date, rdvsMap]) => Object.keys(rdvsMap).length > 0) // On garde seulement les jours avec des rdvs
    //         .map(([date, rdvsMap]) => [date, Object.values(rdvsMap)]); // Convertir les rdvs en tableau de valeurs

    //     // Convertir la structure à jour en format attendu par groupedRdv
    //     const updatedGroupedRdv = Object.entries(filteredRdvByDate).map(([date, rdvsMap]) => [date, Object.values(rdvsMap)]);

    //     // Mettre à jour l'état avec les nouvelles données
    //     setGroupedRdv(filteredRdvByDate);
    //     setSendReload(false); // Réinitialiser le déclencheur de rechargement
    // }, [rdvsupdate]);

    useEffect(() => {
        const totalRdvs = groupedRdv.reduce((acc, [, rdvs]) => acc + rdvs.length, 0); // N 
        if (loadedCount.size === totalRdvs && typeList !== "nouveaux" && !load) {
            let found = false; // Variable pour vérifier si un élément a été trouvé
            const formattedToday = format(new Date(), 'yyyy-MM-dd');
            let dateToCheck = new Date();

            for (let i = 0; i < 20 && !found; i++) { // Boucle sur les 20 prochains jours
                const formattedDate = format(addDays(dateToCheck, i), 'yyyy-MM-dd');
                const dateElement = document.getElementById(`rdv-${instanceId}-${formattedDate}`);
                if (dateElement) {
                    dateElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    found = true; // Un élément correspondant a été trouvé
                }
            }
        }
        load = true;
    }, [loadedCount]);

    const handleVisible = (id) => {

        if (debutRdv === id) {
            console.log('Le rdv visible est le deuxième rdv chargé');
            setDataSend(true);
        }

        if (finRdv === id) {
            console.log("Le rdv visible est l'avant-dernier rdv chargé');");
            setDataSend(true);
        }
    }

    return (
        <div className='rdvlist'>
            {groupedRdv.map(([date, rdvs]) =>
            (

                <div className='displist' id={`rdv-${instanceId}-${date}`} key={date}>
                    <div className="date stickyDate">
                        <span />
                        <p>{format(parseISO(date), 'EEEE dd MMMM', { locale: fr })}</p>
                        <span />
                    </div>
                    {rdvs.map(rdv => (
                        <RdvDisp key={rdv.id} onVisible={handleVisible} type={typeList === "client" ? typeList : "normal"} iopen={typeList === "client"} idrdv={rdv.id} onLoaded={(id) => handleRdvLoad(id)} />
                    ))}
                </div>
            ))}
        </div>
    );
};


export default RdvList;