import React, { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const Calendrier = ({ dispos, rdvs, selectedDates, disposdisp, arrets, chargement, selectedRdv}) => {
    const aujourdHui = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    const [jours, setJours] = useState([]);
    const [heuresDebFin, setHeuresDebFin] = useState({ heureDebut: 7, heureFin: 22}); // 'all' ou 'new'
    const [activeRdv, setActiveRdv] = useState(null);

        // useEffect pour réagir aux changements dans le tableau `jours`
    useEffect(() => {
        chargement(false);
        // Vous pouvez ajouter ici d'autres logiques de vérification
    }, [jours]); // Dépendance à `jours` pour réagir à ses changements


    const generateDaysArray = (startDate, endDate) => {
        const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
        return daysArray.map(day => {
            return {
                j: format(day, 'eee', { locale: fr }), // Format court du jour (ex: Lun, Mar, ...)
                d: format(day, 'd'), // Numéro du jour dans le mois
                m: format(day, 'M'), // Numéro du mois
                m2: format(day, 'MMM', { locale: fr }),
                y: format(day, 'yyyy') // Année
            };
        });
    };

    const generateWeekDaysArray = () => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Définit le début de la semaine au lundi
        const end = endOfWeek(today, { weekStartsOn: 1 }); // Définit la fin de la semaine au dimanche

        const daysArray = eachDayOfInterval({ start, end });
        return daysArray.map(day => ({
            j: format(day, 'eee', { locale: fr }), // Format court du jour
            d: format(day, 'd'), // Numéro du jour dans le mois
            m: format(day, 'M'), // Numéro du mois
            m2: format(day, 'MMM', { locale: fr }), // Nom du mois abrégé
            y: format(day, 'yyyy') // Année
        }));
    };


    useEffect(() => {
        if (!disposdisp && selectedDates.startDate && selectedDates.endDate) {
            setJours(generateDaysArray(selectedDates.startDate, selectedDates.endDate));
        } else {
            setJours(generateWeekDaysArray());
        }
    }, [selectedDates, disposdisp]);
   
   
    useEffect(() => {
        updateHeureDebutFin();
    }, [dispos]);


    const updateHeureDebutFin = () => {
        let minDebut =8; // Commencez avec une valeur plus grande que toute heure possible
        let maxFin = 18; // Commencez avec une valeur plus petite que toute heure possible

        dispos.forEach(dispo => {
            const [heureDebut, minuteDebut] = dispo.debut.split(':').map(Number);
            const [heureFin, minuteFin] = dispo.fin.split(':').map(Number);

            const debutDecimal = heureDebut + minuteDebut / 60; // Convertit l'heure en format décimal
            const finDecimal = heureFin + minuteFin / 60; // Convertit l'heure en format décimal

            if (debutDecimal < minDebut) minDebut = debutDecimal;
            if (finDecimal > maxFin) maxFin = finDecimal;
        });

        let heureDebut = minDebut;
        let heureFin = maxFin;

        setHeuresDebFin({ heureDebut: heureDebut, heureFin: heureFin });
    };


    // Fonction mise à jour pour vérifier les RDVs
    const verifierDisp = (jourSemaine, heureComplete) => {
        jourSemaine = jourSemaine.slice(0, -1); // Supprime le dernier caractère
        for (let dispo of dispos) {
            if (dispo.jour === jourSemaine) {

                const debutHeure = parseInt(dispo.debut.split(':')[0]);
                const debutMinute = parseInt(dispo.debut.split(':')[1]);
                const finHeure = parseInt(dispo.fin.split(':')[0]);
                const finMinute = parseInt(dispo.fin.split(':')[1]);
                const [heure, minute] = heureComplete.split(':').map(x => parseInt(x));
                const debutTotal = debutHeure * 60 + debutMinute;
                const finTotal = finHeure * 60 + finMinute;
                const heureTotal = heure * 60 + minute;
                if (heureTotal >= debutTotal && heureTotal < finTotal) {
                    return { estDansDisp: true, idDisp: dispo.id };
                }
            }
        }
        return { estDansDisp: false, idDisp: null };
    };


    const verifierArrets = (jourComplet, heureComplete, m) => {
        for (let arret of arrets) {
            const jourArret = format(arret.date, 'eee d yyyy', { locale: fr });
            const moisArret = arret.date.getMonth();
            if (jourArret === jourComplet && moisArret === (m - 1)) {
                const debutHeure = parseInt(arret.debut.split(':')[0]);
                const debutMinute = parseInt(arret.debut.split(':')[1]);
                const finHeure = parseInt(arret.fin.split(':')[0]);
                const finMinute = parseInt(arret.fin.split(':')[1]);
                const [heure, minute] = heureComplete.split(':').map(x => parseInt(x));
                const debutTotal = debutHeure * 60 + debutMinute;
                const finTotal = finHeure * 60 + finMinute;
                const heureTotal = heure * 60 + minute;
                if (heureTotal >= debutTotal && heureTotal < finTotal) {
                    return { estDansArret: true, idArret: arret.id };
                }
            }
        }
        return false; // L'heure n'est pas dans un arrêt de travail
    };

    // Fonction renommée pour vérifier si une heure est dans une période de rendez-vous
    const verifierRdv = (jourComplet, heureComplete, m) => {

        for (let rdv of rdvs) {
            const jourRdv = format(rdv.date, 'eee d yyyy', { locale: fr });
            const moisRdv = rdv.date.getMonth();
            if (jourRdv === jourComplet && moisRdv === (m - 1)) {
                const debutHeure = parseInt(rdv.debut.split(':')[0]);
                const debutMinute = parseInt(rdv.debut.split(':')[1]);
                const finHeure = parseInt(rdv.fin.split(':')[0]);
                const finMinute = parseInt(rdv.fin.split(':')[1]);
                const [heure, minute] = heureComplete.split(':').map(x => parseInt(x));
                const debutTotal = debutHeure * 60 + debutMinute;
                const finTotal = finHeure * 60 + finMinute;
                const heureTotal = heure * 60 + minute;
                if (heureTotal >= debutTotal && heureTotal < finTotal) {
                    return { estDansRdv: true, idRdv: rdv.id };
                }
            }
        }
        return { estDansRdv: false, idRdv: null };
    };

    const handleQuartAjout = (jour, heureComplete, m) => {

        alert(`Clic sur le quart d'heure: ${jour} à ${heureComplete} le ${m}`);
    };

    const handleOpenRDV = (idRdv) => {
        selectedRdv(idRdv)
    };

    const handleOpenArret = (idArret) => {

        alert(`Clic sur l'arret: ${idArret} `);
    };

    const normalizeTime = (time)  => {
        const parts = time.split(':');
        const hours = parts[0].padStart(2, '0'); // Ajoute un zéro si nécessaire
        return `${hours}:${parts[1]}`;
    }

    const calculerHauteurAvecHeures = (debut, fin, baseHeight)  =>  {
        const debutHeures = parseInt(debut[0]);
        const finHeures = parseInt(fin[0]);
        const debutMinutes = parseInt(debut[1]);
        const finMinutes = parseInt(fin[1]);
        // Calcul du nombre d'heures complètes dépassées
        let heuresCompletes = 0;
        for (let h = debutHeures + 1; h <= finHeures; h++) {
            heuresCompletes += (debutMinutes > 0 && h === debutHeures + 1) || (finMinutes < 60 && h === finHeures) ? 0 : 1;
        }
    
        // Ajout de 2 pixels par heure complète
        const pixelsSupplementaires = heuresCompletes * 2;
    
        // Calcul de la hauteur finale
        return `calc(${baseHeight} + ${pixelsSupplementaires}px)`;
    }

    const isRdvActive = (idRdv) => {
        return activeRdv === idRdv;
    };

    const genererQuarts = (heure, jour, numero, annee, m) => {
        const minutes = Array.from({ length: 12 }, (_, i) => i * 5).map(String); // Générer des minutes de 5 en 5
        return minutes.map(minute => {
            minute = minute.padStart(2, '0'); // Assurez-vous que le format de minute est correct (ex: '05' au lieu de '5')
            const heureComplete = `${heure}:${minute}`;
            const jourComplet = `${jour} ${numero} ${annee}`;
            const { estDansDisp, idDispo } = verifierDisp(jour, heureComplete);
            const { estDansRdv, idRdv } = verifierRdv(jourComplet, heureComplete, m);
            const { estDansArret, idArret } = verifierArrets(jourComplet, heureComplete, m);
            const arret = arrets.find(r => r.id === idArret);
            const rdv = rdvs.find(r => r.id === idRdv);
            const estConfirme = rdv && !rdv.confirme;
            const classeCellule = estDansRdv || estDansArret ? ( estDansRdv && estConfirme ? `quart rdv confirme rdv-${idRdv}` : `quart rdv rdv-${idRdv}`) : 'quartn';
            const idCellule = estDansRdv ? `rdv-${idRdv}-${jour}-${heureComplete}` : '';
            const classeArret = estDansArret ? 'arret' : '';
            let sousDiv = null;

            
            if (estDansRdv) {
                const estDebutRdv = rdvs.some(rdv =>
                    format(rdv.date, 'eee d yyyy', { locale: fr }) === jourComplet && normalizeTime(rdv.debut) === normalizeTime(heureComplete)
                );
                if (estDebutRdv) {
                    const rdv = rdvs.find(r => r.id === idRdv);
                    const debut = rdv.debut.split(':');
                    const fin = rdv.fin.split(':');
                    
                    const dureeEnMinutes = (parseInt(fin[0]) * 60 + parseInt(fin[1])) - (parseInt(debut[0]) * 60 + parseInt(debut[1]));
                    const dureeEnQuarts = dureeEnMinutes / 5;
                    let hauteurBase = `calc(${dureeEnQuarts * 100}% + ${(Math.round((dureeEnQuarts) / 12)) * 2}px )`;
                    let hauteurDiv = calculerHauteurAvecHeures(debut, fin, hauteurBase);
                    
                    sousDiv =
                        <div className="case-rdv " style={{ height: hauteurDiv }}>
                            <a className='fin' href="#">
                                <p>{rdv.voiture}</p>

                            </a>
                        </div>
                        ;
                }
            }
            else if (estDansArret) {
                const estDebutArret = arrets.some(rdv =>
                    format(rdv.date, 'eee d yyyy', { locale: fr }) === jourComplet && normalizeTime(rdv.debut) === normalizeTime(heureComplete)
                );
                if (estDebutArret) {
                    const arret = arrets.find(r => r.id === idArret );
                    const debut = arret.debut.split(':');
                    const fin = arret.fin.split(':');
                    const dureeEnMinutes = (parseInt(fin[0]) * 60 + parseInt(fin[1])) - (parseInt(debut[0]) * 60 + parseInt(debut[1]));
                    const dureeEnQuarts = dureeEnMinutes / 5;
                    const hauteurDiv = `calc(${dureeEnQuarts * 100}% + ${(Math.round((dureeEnQuarts) / 12)) * 2}px )`;

                    sousDiv =
                        <div className="case-arret " style={{ height: hauteurDiv }}>
                            <a className='fin' href="#">
                                <p>Pause</p>
                            </a>
                        </div>
                        ;
                }
            }

            return (
                <div className={`${classeCellule} ${classeArret} ${estDansDisp ? 'disp' : ''} ${rdv && rdv.id && isRdvActive(rdv.id) ? 'active' : ''}`} id={idCellule} key={`${jour}-${heureComplete}`} onClick={() => {
                    if (!disposdisp) {
                        if (estDansRdv) {
                            handleOpenRDV(rdv.id);
                            setActiveRdv(idRdv);
                        } else if (estDansArret) {
                            handleOpenArret(arret.id);
                        } else {
                            handleQuartAjout(jour, heureComplete, m);
                        }
                    }
                }}>
                    {sousDiv}
                </div>
            );
        });
    };



    return (
        <div className={disposdisp ? 'calendrier disposdisp' : 'calendrier'}>
            <div className='heures'>
                <div className='entete'><p>heure</p><p>-</p></div>
                <div className='contentj'>
                    {Array.from({ length: heuresDebFin.heureFin - heuresDebFin.heureDebut + 2 }, (_, i) => Math.round(heuresDebFin.heureDebut) + i).map(heure => (
                        <div className='heure des' key={heure - 1}>
                            <p>{heure}:00</p>
                        </div>
                    ))}
                </div>
            </div>
            {jours.map(({ j, d, y, m, m2 }) => {
                // Créez une chaîne de caractères pour la date de chaque élément
                const dateElement = `${d}-${m}-${y}`;
                const classeJour = dateElement === aujourdHui ? "jour today" : "jour";

                return (
                    <div className={classeJour} key={`${d}-${y}-${m}`}>
                        <div className='entete'> <p>{`${j}`}</p> <p className='strong'>{` ${d} ${m2}`}</p> </div>
                        <div className='contentj'>
                            {Array.from({ length: heuresDebFin.heureFin - heuresDebFin.heureDebut + 2  }, (_, i) => heuresDebFin.heureDebut + i).map(heure => (
                                <div className='heure' key={`${j}-${d}-${heure}`}>
                                    {genererQuarts(heure, j, d, y, m)}
                                </div>

                            ))}</div>
                    </div>
                )
            })}
        </div>
    );
};

export default Calendrier;