import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import { parseISO } from 'date-fns';
import useFetch from '../hooks/useFetch';
registerLocale('fr', fr);


const HorairesForm = ({ datadispos, newdispo, idPage }) => {
    const [dispos, setDispos] = useState({
    });


    // État pour suivre le DatePicker actuellement ouvert
    const [openDatePicker, setOpenDatePicker] = useState(null);
    const [isFocusFromMouse, setIsFocusFromMouse] = useState(false);
    const [submitData, setSubmitData] = useState(null);
    const [sendSubmit, setSendSubmit] = useState(false);    
    const [btnSave, setBtnSave] = useState(false);
    const { data: soummission, loading, error } = useFetch(`/prestataire-pages/${idPage}`, 'Put', submitData, true, sendSubmit);

    // Gérer l'interaction de la souris avant le focus
    const handleMouseDown = () => {
        setIsFocusFromMouse(true);
    };

    const handleRetour = () => {
        setBtnSave(false);
        setDispos(newdispo);
    }


    // Gérer l'ouverture d'un DatePicker
    const handleOpenDatePicker = (jour, periode, champ) => {
        if (isFocusFromMouse) {
            setOpenDatePicker({ jour, periode, champ });
            setIsFocusFromMouse(false);
        } 
    };

    // Gérer la fermeture d'un DatePicker
    const handleCloseDatePicker = () => {
        setOpenDatePicker(null);
    };

    function convertirEtFormaterEnDate(heure) {

        // Assurez-vous que l'heure est au format HH:mm
        const heureFormattee = heure.length === 4 ? '0' + heure : heure;

        // Utilisez parseISO pour convertir en objet Date
        const date = parseISO(`2022-01-01T${heureFormattee}:00`);

        // Vérifie si la date est valide
        if (isNaN(date)) {
            console.error("Date invalide:", heure);
            return null;
        }

        return date; // Convertit et formate la date
    }

    // Fonction auxiliaire pour formater l'heure
    const formatTime = (date) => {
        if (!date) return '';
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    function transformEtInitialiser(disposData) {
        const joursMapping = {
            'lun': 'Lundi',
            'mar': 'Mardi',
            'mer': 'Mercredi',
            'jeu': 'Jeudi',
            'ven': 'Vendredi',
            'sam': 'Samedi',
            'dim': 'Dimanche'
        };

        const periodesMapping = {
            'am': 'matin',
            'pm': 'apresMidi',
            'night': 'soir'
        };

        const etatInitial = {
            Lundi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Mardi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Mercredi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Jeudi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Vendredi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Samedi: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
            Dimanche: { selectionne: false, matin: { actif: false, debut: '', fin: '' }, apresMidi: { actif: false, debut: '', fin: '' }, soir: { actif: false, debut: '', fin: '' } },
        };

        disposData.forEach(dispo => {
            const jour = joursMapping[dispo.jour];
            const periode = periodesMapping[dispo.periode];
            if(jour){
                etatInitial[jour].selectionne = true;
            }
            if(periode){
                etatInitial[jour][periode].actif = true;            // Convertir les heures en objets Date
                etatInitial[jour][periode].debut = convertirEtFormaterEnDate(dispo.debut);
                etatInitial[jour][periode].fin = convertirEtFormaterEnDate(dispo.fin);
            }
            


        });


        return etatInitial;
    }

    // Utiliser useEffect pour initialiser l'état au chargement du composant
    useEffect(() => {
        if (datadispos) {
            const disposTransformees = transformEtInitialiser(datadispos);
            setDispos(disposTransformees);
        }
    }, [datadispos]); // Dépendance à datadispos pour ne s'exécuter que lorsque datadispos change

   
    const transformerDisposPourParent = (updatedDispos) => {
        const result = [];
        let returnactiv = false;
        const joursMapping = { 'Lundi': 'lun', 'Mardi': 'mar', 'Mercredi': 'mer', 'Jeudi': 'jeu', 'Vendredi': 'ven', 'Samedi': 'sam', 'Dimanche': 'dim' };
        const periodesMapping = { 'matin': 'am', 'apresMidi': 'pm', 'soir': 'night' };
        let idCounter = 1;

        Object.keys(updatedDispos).forEach(jour => {
            const jourAbr = joursMapping[jour];

            Object.keys(periodesMapping).forEach(periode => {
                const periodeAbr = periodesMapping[periode];

                // Vérifier si la période existe pour le jour donné
                if (updatedDispos[jour][periode].actif) {
                    const debut = updatedDispos[jour][periode].debut ? formatTime(updatedDispos[jour][periode].debut) : '';
                    const fin = updatedDispos[jour][periode].fin ? formatTime(updatedDispos[jour][periode].fin) : '';

                    if (debut && fin) {
                        result.push({ id: idCounter++, jour: jourAbr, debut, fin, periode: periodeAbr });
                        returnactiv = true;
                    }
                } 
            });
        });


        setDispos(updatedDispos);
        setIsFocusFromMouse(false);
        if (returnactiv) {
            return result;
        }

    };



    const handleTimeChange = (date, jour, periode, champ) => {
        
        setBtnSave(true);
        const updatedDispos = {
            ...dispos,
            [jour]: {
                ...dispos[jour],
                [periode]: { ...dispos[jour][periode], [champ]: date }
            }
        };

        // Vérification que 'debut' et 'fin' sont bien définis
        const debut = champ === 'debut' ? date : updatedDispos[jour][periode].debut;
        const fin = champ === 'fin' ? date : updatedDispos[jour][periode].fin;

        if (debut && fin) {
            // Exécution de la logique supplémentaire si 'debut' et 'fin' sont définis
            performAdditionalActions(updatedDispos);
        } else {

            setDispos(updatedDispos);
            // Vous pouvez gérer ici le cas où 'debut' ou 'fin' n'est pas défini
        }
        setTimeout(() => {

            setIsFocusFromMouse(true);
        }, 1);
        setOpenDatePicker(null);
    };

    const handleJourSelection = (jour, selected) => {
        
        setBtnSave(true);
        const jourSelectionne = !dispos[jour].selectionne;

        // Créez un nouvel objet updatedDispos avec les modifications nécessaires
        const updatedDispos = {
            ...dispos,
            [jour]: {
                ...dispos[jour],
                selectionne: jourSelectionne,
                // Mettre à jour les périodes si le jour est désélectionné
                ...(!jourSelectionne ? {
                    matin: { ...dispos[jour].matin, actif: false },
                    apresMidi: { ...dispos[jour].apresMidi, actif: false },
                    soir: { ...dispos[jour].soir, actif: false }
                } : {})
            }
        };

        if(selected){
            performAdditionalActions(updatedDispos);
        } else {
            setDispos(updatedDispos);
        }
    };
    



    const handlePeriodeChange = (jour, periode) => {
        const periodeActive = !dispos[jour][periode].actif;

        const updatedDispos = {
            ...dispos,
            [jour]: {
                ...dispos[jour],
                [periode]: {
                    ...dispos[jour][periode],
                    actif: periodeActive,
                    debut: periodeActive ? dispos[jour][periode].debut : null,
                    fin: periodeActive ? dispos[jour][periode].fin : null
                }
            }
        };

        if (!periodeActive) {

            performAdditionalActions(updatedDispos);

            setTimeout(() => {

                setIsFocusFromMouse(true);
            }, 1);
            setOpenDatePicker(null);
        }
        else {
            setDispos(updatedDispos);
        }

    };




    const performAdditionalActions = (updatedDispos) => {
        const nouvellesInfos = transformerDisposPourParent(updatedDispos);
        newdispo(nouvellesInfos);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitData(dispos)
        setSendSubmit(true);
        // Transformer l'état en tableau de disponibilités
        // et effectuer des actions supplémentaires si nécessaire
    };

    return (
        <form className='horairesform' onSubmit={handleSubmit}>
            {Object.keys(dispos).map(jour => (
                <div className='jour' key={jour}>
                    <label className='jourlabel'>
                        <input
                            type="checkbox"
                            checked={dispos[jour].selectionne}
                            onChange={() => handleJourSelection(jour, dispos[jour].selectionne)}
                        />
                        {jour}
                    </label>
                    {dispos[jour].selectionne && (
                        <div className='heures'>
                            {['matin', 'apresMidi', 'soir'].map(periode => (
                                <div className='periode' key={dispos.jour}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={dispos[jour][periode].actif}
                                            onChange={() => handlePeriodeChange(jour, periode)}
                                        />
                                        {periode}
                                    </label>
                                    {dispos[jour][periode].actif && (
                                        <>
                                            <div onMouseDown={handleMouseDown}>
                                                <DatePicker
                                                    className='inputs small'
                                                    locale="fr"
                                                    selected={dispos[jour][periode].debut}
                                                    onChange={(date) => handleTimeChange(date, jour, periode, 'debut')}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    onMouseDown={handleMouseDown}
                                                    timeCaption="Heure"
                                                    timeFormat="HH:mm"
                                                    dateFormat="HH:mm"
                                                    onFocus={() => handleOpenDatePicker(jour, periode, 'debut')}
                                                    onBlur={handleCloseDatePicker}
                                                    open={openDatePicker?.jour === jour && openDatePicker?.periode === periode && openDatePicker?.champ === 'debut'}
                                                />
                                            </div>
                                            <p> - </p>
                                            <div onMouseDown={handleMouseDown}>
                                                <DatePicker
                                                    className='inputs small'
                                                    locale="fr"
                                                    selected={dispos[jour][periode].fin}
                                                    onChange={(date) => handleTimeChange(date, jour, periode, 'fin')}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Heure"
                                                    timeFormat="HH:mm"
                                                    dateFormat="HH:mm"
                                                    onFocus={() => handleOpenDatePicker(jour, periode, 'fin')}
                                                    onBlur={handleCloseDatePicker}
                                                    open={openDatePicker?.jour === jour && openDatePicker?.periode === periode && openDatePicker?.champ === 'fin'}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    )}
                </div>

            ))}
           <button className={btnSave ? "btn-pro scnd " : "btn-pro scnd off"} onClick={() => handleRetour()} type='button'> <p>Annuler</p></button>
          <button className={btnSave ? "btn-pro  " : "btn-pro off"} onClick={(e) => handleSubmit(e)} type='submit'> <p>Sauvegarder</p></button>
                     
        </form>
    );
};

export default HorairesForm;