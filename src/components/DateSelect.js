import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, format, getDay, parse, parseISO, isWithinInterval, addMinutes, isBefore, isAfter,isSameDay,formatISO, format as formatTime, set } from 'date-fns';
import { fr } from 'date-fns/locale';
import useFetch from '../hooks/useFetch';
import Loader from './Loader';

const daysMapping = {
    '0': 'dim',
    '1': 'lun',
    '2': 'mar',
    '3': 'mer',
    '4': 'jeu',
    '5': 'ven',
    '6': 'sam',
};

const periodMapping = {
    am: 'matin',
    pm: 'après-midi',
    night: 'soir',
};




function adjustTimeToDate(dateTimeISO, time) {
    const date = parseISO(dateTimeISO); // Convertir la date ISO en objet Date
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0); // Ajuster les heures et les minutes sur la date de l'objet Date
    return date;
}

function parseTime(time, referenceDate = new Date()) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(referenceDate.setHours(hours, minutes, 0, 0));
    return date;
}

function generateTimeSlots(debut, fin, rendezVousData, interval, dureee, trajet ) {
    const ntrajet = Math.ceil(trajet / 5) * 5;
    let slots = [];
    let startTime ; 
    let endTime ;
    console.log( "trajet", ntrajet)
    console.log("rdv", rendezVousData);
    if(rendezVousData[0] &&  rendezVousData[0].debut) {
        console.log("oui");
        const referenceDateISO = rendezVousData[0].debut.split('T')[0]; // Extraire seulement la date YYYY-MM-DD
         startTime = adjustTimeToDate(referenceDateISO + 'T' + debut + ':00.000Z', debut);
         endTime = adjustTimeToDate(referenceDateISO + 'T' + fin + ':00.000Z', fin);
    }
    else{
         startTime = parseTime(debut);
         endTime = parseTime(fin);
    }
    
    rendezVousData = rendezVousData.map(rdv => ({
        ...rdv,
        debut: parseISO(rdv.debut),
        fin: parseISO(rdv.fin),
    }));


    //console.log(rendezVousData, debut, fin, interval, dureee, startTime, endTime);

    while (isBefore(startTime, endTime)) {
        let endSlotTime = addMinutes(startTime, dureee);
        let slotIsFree = true;
        if (isAfter(endSlotTime, endTime)) {
            break; // Sortir de la boucle while si le rendez-vous dépasse endTime
        }
        for (let rdv of rendezVousData) {
            if (isBefore(startTime, rdv.fin) && isBefore(rdv.debut, endSlotTime)) {
                slotIsFree = false;
                // Ajuster startTime pour le positionner juste après la fin du rdv si cela est plus tard que l'actuel startTime + interval
                if (isAfter(rdv.fin, startTime)) {
                    startTime = addMinutes(rdv.fin, ntrajet); // Mettre à jour startTime pour reprendre après la fin du rdv
                }
                break; // Sortir de la boucle car le créneau actuel n'est pas libre
            }
        }

        if (slotIsFree) {
            slots.push(format(startTime, 'HH:mm')); // Ajouter le créneau libre formaté
            startTime = addMinutes(startTime, interval);; // Passer au prochain créneau
        } else {
            // Si le créneau n'est pas libre, il n'est plus nécessaire d'ajuster startTime ici, car cela a été fait dans la boucle for
        }
    }

    
    return slots;
}




const groupScheduleByDay = (data, rendezVous, specificDay, selectedDayShortFormat, interval,dureeRdv, trajet) => {
    // Conversion de specificDay en format YYYY-MM-DD si ce n'est pas déjà le cas
    const specificDayFormatted = new Date(specificDay).toISOString().split('T')[0];

    const filteredRendezVous = rendezVous.filter(rdv => {
        // Créer un objet Date à partir de la date de début du rendez-vous
        const rdvDate = new Date(rdv.debut);
        // Ajuster la date spécifique pour qu'elle soit interprétée dans la zone horaire locale
        // en ajoutant "T00:00" pour s'assurer qu'elle est à minuit dans la zone horaire locale
        const specificDate = new Date(`${specificDayFormatted}T00:00`);

        // Comparer l'année, le mois et le jour directement
        return rdvDate.getFullYear() === specificDate.getFullYear() &&
            rdvDate.getMonth() === specificDate.getMonth() &&
            rdvDate.getDate() === specificDate.getDate();
    });


    const groupedData = data.reduce((acc, current) => {
        const { jour, debut, fin, periode } = current;
        // Vérification si le jour courant correspond à specificDayFormatted
        if (jour !== selectedDayShortFormat) return acc;

        acc[jour] = acc[jour] || { am: [], pm: [], night: [] };
        // Utilisation des rendezVous filtrés pour générer les créneaux
        acc[jour][periode] = acc[jour][periode].concat(generateTimeSlots(debut, fin, filteredRendezVous, interval,dureeRdv, trajet));
        console.log("slots", specificDay , jour , acc[jour][periode]);
        return acc;
    }, {});
    return groupedData;
};



const DateSelect = ({ horaires, interval,dureeRdv, result, edit, prestatairepage,trajet}) => {




    const today = new Date();
   const [dataSend, setDataSend] = useState(true);

    const [rendezVous, setRendezVous] = useState([]);
    const [loading, setLoading] = useState(true);
    const yesterday = addDays(today, -1);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTime, setSelectedTime] = useState(null);
    const [weekDaysInfo, setWeekDaysInfo] = useState([]);
    const [isCurrentOrFutureWeek, setIsCurrentOrFutureWeek] = useState(true);
    const [dateDisp , setDateDisp] = useState("")
    const [firstDate, setFirstDate] = useState(null);
    const [actualfirstDate, setActualfirstDate] = useState(null);
    const [startDay, setStartDay] = useState(today.toISOString());
    const endDayCalc = new Date();
    endDayCalc.setDate(today.getDate() + 15); // Ajoute 14 jours à la date actuelle
    const [endDay, setEndDay] = useState(endDayCalc.toISOString());    
    const { data: rdvsdata, loading: rdvsloading } = useFetch(`/rendezvous/confirme`, 'GET', null, true, dataSend);    
    

    // Ajout de cette fonction pour initialiser ou mettre à jour weekDaysInfo
    const updateWeekDaysInfo = (date) => {
        
    console.log( "trajet", trajet)
        const startOfSelectedWeek = startOfWeek(date, { weekStartsOn: 1 });

        const newWeekDaysInfo = Array.from({ length: 7 }).map((_, index) => {
            const day = addDays(startOfSelectedWeek, index);
            const dayShortFormat = format(day, 'EEE', { locale: fr }).toLowerCase().replace('.', '');
            // Utilisation de groupScheduleByDay2 pour obtenir les horaires groupés pour ce jour spécifique
            const groupedSchedule = groupScheduleByDay(horaires, rendezVous, day, dayShortFormat, interval,dureeRdv,trajet);
            // Vérifier si des plages horaires sont disponibles pour ce jour
            const hasAvailability = groupedSchedule[dayShortFormat] && 
            Object.values(groupedSchedule[dayShortFormat]).some(period => period.length > 0) &&
            (isAfter(day, today));
            return {
                formatted: format(day, 'dd MMM', { locale: fr }).replace('.', ''),
                sday: format(day, 'eee', { locale: fr }),
                short: dayShortFormat,
                date: day,
                groupSchedule: groupedSchedule,
                hasAvailability: hasAvailability // Mise à jour basée sur les résultats de groupScheduleByDay2
            };
        });

        // Vérifie si aucune journée de la semaine actuelle n'a de disponibilité
        if (!newWeekDaysInfo.some(dayInfo => dayInfo.hasAvailability)) {
            // Si aucune disponibilité, définir la semaine suivante comme la nouvelle semaine sélectionnée
            
            const startOfNextWeek = addDays(startOfSelectedWeek, 7);
            if(rdvsdata) updateWeekDaysInfo(startOfNextWeek) // Appel récursif avec la date de début de la semaine suivante
        } else {
            // Si au moins un jour est disponible, mettre à jour l'état avec les informations de la semaine actuelle
            setWeekDaysInfo(newWeekDaysInfo);
            // Optionnel : Mettre à jour la date sélectionnée sur le premier jour disponible de la semaine
            const firstAvailableDay = newWeekDaysInfo.find(dayInfo => dayInfo.hasAvailability)?.date;
            setActualfirstDate(firstAvailableDay); 
            if (firstAvailableDay) {
                setSelectedDate(null);
                result(null); 
                if(!firstDate)
                    setFirstDate(firstAvailableDay);
                else isSameDay(firstDate, firstAvailableDay) ? setIsCurrentOrFutureWeek(true) : setIsCurrentOrFutureWeek(false);
            }
        }
    };

    useEffect(() => { 
        // Initialiser weekDaysInfo lors du chargement du composant
        if(rdvsdata){ 
            console.log("dataaaaa" , rdvsdata);
            updateWeekDaysInfo(selectedDate ? selectedDate : actualfirstDate)} ;
        console.log("dataaaaa" , rdvsdata);
    }, [dureeRdv,rendezVous]); // Le tableau vide indique que cet effet ne s'exécute qu'une fois, au montage du composant

    useEffect(() => {
        if(rdvsdata){
            const formattedRdvs = rdvsdata.data.map(rdv => ({
                id: rdv.id,
                debut: rdv.date,
                fin: rdv.datefin,
                // La description est omise car vous avez mentionné de ne pas l'inclure
            }));
    
            setRendezVous(formattedRdvs);
            setDataSend(false);
        } 
    }, [rdvsdata]); // Le tableau vide indique que cet effet ne s'exécute qu'une fois, au montage du composant

    const changeWeek = (offset) => {
        // Calculer la nouvelle date sélectionnée avec l'offset
        const newSelectedDate = addDays(actualfirstDate, 7 * offset);
     
        // Trouver le début de la semaine pour la date sélectionnée et le début de la semaine actuelle
        const startOfNewWeek = startOfWeek(newSelectedDate, { weekStartsOn: 1 });
        const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
        // Comparer si le début de la nouvelle semaine est avant le début de la semaine actuelle
        if (startOfNewWeek >= startOfCurrentWeek) {
            // Si la nouvelle semaine est la même que la semaine actuelle ou une future, permettre la mise à jour
            setSelectedDate(newSelectedDate);setSelectedTime(null) ; result(null);
            if(rdvsdata) updateWeekDaysInfo(newSelectedDate); // Assurez-vous que cette fonction met à jour correctement weekDaysInfo pour la nouvelle semaine
        } else {
            // Sinon, ne rien faire ou afficher un message d'erreur si nécessaire
            console.log("Impossible de charger une semaine avant la semaine actuelle.");
             // Mise à jour de l'état pour refléter que la navigation vers une semaine précédente est bloquée
        }
    };


    const dayInfo = selectedDate ? weekDaysInfo.find(day => format(day.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')):null;


    // Appel de la fonction avec le jour spécifique
    const groupedScheduleForSpecificDay = dayInfo ? dayInfo.groupSchedule : null;

    const handleDateSelection = (day) => {
        // Mettre à jour la date sélectionnée
        setSelectedDate(day.date);
        result(null);
        // Réinitialiser le temps sélectionné lors du changement de date
        setSelectedTime(null);
        setDateDisp(` `);
    };

    const handleTimeSelection = (day, time) => {
        setSelectedTime({ day: day.formatted, time });
        
        const formattedDate = format(selectedDate, "EEEE dd MMMM", { locale: fr });
    
        // Parser l'heure de début pour obtenir un objet Date
        const startTime = parse( time, 'HH:mm', selectedDate);
        
        // Calculer l'heure de fin à partir de l'intervalle
        const endTime = addMinutes(startTime, dureeRdv);
        
        // Formater les heures de début et de fin
        const formattedStartTime = format(startTime, "HH'h'mm", { locale: fr });
        const formattedEndTime = format(endTime, "HH'h'mm", { locale: fr });
        
        setDateDisp(` ${formattedDate} - ${formattedStartTime} - ${formattedEndTime}`);
        // Utiliser formatISO pour formatter les dates au format ISO 8601
        const formattedStartDate = formatISO(startTime);
        const formattedEndDate = formatISO(endTime);

        // Supposant que `result` est une fonction de callback où vous voulez envoyer les résultats formatés
        result({
            date: formattedStartDate,
            datefin: formattedEndDate,
        });
    };


    return (
        <div className="dateSelect">
        <h4>Date et heure</h4>
        {!rdvsdata ? <Loader></Loader> :
            <div className="dateSelect">
            <div className="title"> 
                <span className='verti'></span>
                <p className='desc'>Sélectionné: </p>
                {selectedDate && 
                <p>{dateDisp}</p> }
            </div>
            {edit && 
            <div className="week-days">
                <button  className={`btn-base ${isCurrentOrFutureWeek ? 'disabled' : ''}`}  onClick={() => changeWeek(-1)}><svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.36555 0.0634767L6.31252 1.11651L6.31239 1.11637L3.47689 3.95187L3.47685 3.95183L0.276298 7.15238H0.218262L0.24728 7.1814L0.218295 7.21039H0.276266L3.07575 10.0099L3.07572 10.0099L4.5296 11.4638H4.52993L5.91158 12.8454L5.91154 12.8455L7.36541 14.2993L10.9745 14.2993L8.11701 11.4418L8.11705 11.4418L6.66317 9.98791H6.66284L5.28122 8.60629L5.28125 8.60626L3.85639 7.1814L4.7083 6.32949L4.70834 6.32953L7.71597 3.3219L7.7161 3.32203L10.9747 0.0634766L7.36555 0.0634767Z" fill="#006963" />
                </svg>
                </button>
                {weekDaysInfo.map((day) => (
                    <div key={day.formatted}
                        className={
                            `${ selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd') ? 'day active' : 'day'} 
                        ${!day.hasAvailability || isBefore(day.date, today) ? 'ferme' : ''}`
                        }
                        onClick={() => day.hasAvailability && !isBefore(day.date, today) && handleDateSelection(day)}>
                        <p>{day.sday}</p>
                        <h5>{day.formatted}</h5>
                    </div> 
                ))}
                <button className='btn-base' onClick={() => changeWeek(1)}>
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.82732 14.2993L4.88035 13.2463L4.88049 13.2464L7.71598 10.4109L7.71602 10.411L10.9166 7.21041L10.9746 7.21041L10.9456 7.18139L10.9746 7.1524L10.9166 7.1524L8.11712 4.35292L8.11715 4.35289L6.66327 2.89902L6.66294 2.89902L5.28129 1.51736L5.28133 1.51732L3.82746 0.0634448L0.218347 0.063446L3.07586 2.92096L3.07582 2.921L4.5297 4.37488L4.53003 4.37488L5.91165 5.7565L5.91162 5.75653L7.33648 7.18139L6.48457 8.0333L6.48453 8.03326L3.4769 11.0409L3.47677 11.0408L0.218213 14.2993L3.82732 14.2993Z" fill="#006963" />
                    </svg>
                </button>
            </div>}
            {edit && selectedDate && groupedScheduleForSpecificDay && groupedScheduleForSpecificDay[daysMapping[getDay(selectedDate)]] && rdvsdata && (
                <div className="time-slots">
                    {/* Ici, adaptez l'affichage en fonction de la période de la journée (matin, après-midi, soir) */}
                    {Object.entries(groupedScheduleForSpecificDay[daysMapping[getDay(selectedDate)]]).map(([periode, times]) => (
                        times.length > 0 && (
                            <React.Fragment key={periode} >
                                <div className="plages">
                                    <h5>{periodMapping[periode] ? periodMapping[periode].charAt(0).toUpperCase() + periodMapping[periode].slice(1) : periode} : </h5>
                                    <div className='listh'>
                                        {times.map((time, index) => (
                                            <button className={selectedTime?.time === time ? 'btn-h active' : 'btn-h '} key={index} onClick={() => handleTimeSelection(selectedDate, time)}><p>{time}</p> </button>
                                        ))}
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    ))}

                </div>
            )} </div>}
        </div>
    );
};

export default DateSelect; 