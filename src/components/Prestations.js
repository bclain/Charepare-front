import React, { FC, useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import Modal from "./Modal";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";

const Prestations = ({ confirm, dataPage, newData }) => {


    const [submitData, setSubmitData] = useState(null);
    const [sendSubmit, setSendSubmit] = useState(false);
    const [idPage, setIdPage] = useState(null);

    const { data: soummission, loading, error } = useFetch(`/pageGarages/${idPage}`, 'Put', submitData, true, sendSubmit);


    const sortedPrestations =  useState([]);

    const [prestations, setPrestations] = useState(sortedPrestations);

    const [btnSave, setBtnSave] = useState(false);
    const [formState, setFormState] = useState({ id_prestation: null, titre: '', temps: '-', prix: '-', type: 'prestation' });
    const [errors, setErrors] = useState({ titre: '', temps: '', prix: '' });
    const [actionType, setActionType] = useState(null); // 'editing', 'adding', 'deleting'

    const handleInputChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (dataPage  && dataPage.attributes) {
            // Supposons que 'data' contient les champs directement
            setSendSubmit(false);
            setIdPage(dataPage.id);
            setPrestations(dataPage.attributes.prestations.sort((a, b) => a.position - b.position));
            confirm(false);
            setBtnSave(false);
        }
    }, [dataPage]);

    const handleRetour = () => {
        setBtnSave(false);
        confirm(false);
        setPrestations(dataPage.attributes.prestations.sort((a, b) => a.position - b.position));
    }

    useEffect(() => {
        if(soummission){
            newData(soummission)
            setBtnSave(false)
        }
    }, [soummission]);


    

    // Fonction pour valider les champs
    const validateFields = () => {
        const newErrors = { titre: '', temps: '', prix: '' };
        let isValid = true;

        if (!formState.titre) {
            newErrors.titre = 'Le titre est requis.';
            isValid = false;
        }
        if (formState.type === "prestation") {
            if (!formState.temps) {
                newErrors.temps = 'Le temps est requis.';
                isValid = false;

            } else if (formState.temps < 5 || formState.temps > 480) {
                newErrors.temps = 'Le temps doit être entre 5 et 480 minutes.';
                isValid = false;
            }
            if (!formState.prix) {
                newErrors.prix = 'Le prix est requis.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (submitData) {
            setSendSubmit(true);
        }

    }, [submitData]);
    
    const handleSave = async (e) => {
         // Empêcher le rechargement de la page

        const formData = new FormData();
        const newdata = {};

        newdata.prestations = prestations;

        formData.append('data', JSON.stringify(newdata));

        setSubmitData(formData);

    };

    const handleSubmit = (e) => {

        e.preventDefault();
        const newPrestation = { ...formState };


        const isValid = validateFields();

        if (isValid) {

            if (actionType == "editing") {
                // Logique de modification
                setPrestations(prestations.map(prestation =>
                    prestation.id_prestation === newPrestation.id_prestation ? newPrestation : prestation
                ));
            } else if (actionType === "deleting") {
                // Logique de suppression
                setPrestations(prestations.filter(prestation =>
                    prestation.id_prestation !== newPrestation.id_prestation
                ));
            } else {
                // Logique d'ajout
                // Générer un nouvel ID unique pour la nouvelle prestation
                const newId = Math.max(...prestations.map(p => p.id_prestation)) + 1;
                newPrestation.id_prestation = newId;
                newPrestation.position = 1; // Positionner la nouvelle prestation en premier

                // Mettre à jour les positions des prestations existantes
                const updatedPrestations = prestations.map(prestation => ({
                    ...prestation,
                    position: prestation.position + 1
                }));

                // Ajouter la nouvelle prestation et trier par position
                setPrestations([newPrestation, ...updatedPrestations].sort((a, b) => a.position - b.position));
            }
            // Réinitialiser le formulaire et fermer
            setFormState({ id_prestation: null, titre: '', temps: '', prix: '', type: 'prestation' });
            setActionType(null);
            setBtnSave(true)
            confirm(true)
        }
    };

    const handleEdit = (prestation) => {
        setFormState({ ...prestation });
        setActionType('editing');
    };

    const handleDelete = (prestation) => {
        setFormState({ ...prestation });
        setActionType('deleting');
    };

    const handleAdd = (ntype) => {
        setFormState({ id_prestation: null, titre: '', temps: '', prix: '', type: ntype });
        setActionType('adding');
    };

    const arraysAreEqual = (array1, array2) => {
        if (array1.length !== array2.length) return false;
        for (let i = 0; i < array1.length; i++) {
            if (array1[i].id_prestation !== array2[i].id_prestation || array1[i].position !== array2[i].position) {
                return false;
            }
        }
        return true;
    };

    // Fonction pour mettre à jour les positions après un glisser-déposer
    const updatePositions = (newList) => {
        const updatedPrestations = newList.map((item, index) => ({
            ...item,
            position: index + 1
        }));
        if (!arraysAreEqual(prestations, updatedPrestations)) {
            setBtnSave(true);
            confirm(true);
        }
        setPrestations(updatedPrestations);
    };




    return (
        <div className='flex-h'>
            <Modal active={actionType ? true : false} >
                <form className={actionType == "deleting" ? 'suppr' : ''} onSubmit={handleSubmit}>
                    <h3>{actionType == "editing" ? 'Modifier' : (actionType == "deleting" ? 'Supprimer' : 'Ajouter')} une prestation: </h3>
                    <input type="number" value={formState.id_prestation} hidden />
                    <div className="form-group dnone">
                        <label htmlFor="type">Type</label>
                        <select
                            className="inputs"
                            name="type"
                            id="type"
                            value={formState.type}
                            onChange={handleInputChange}
                        >
                            <option value="prestation">Prestation</option>
                            <option value="titre">Titre</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="titre">Intitulé*</label>
                        <input
                            className="inputs"
                            type="text"
                            name="titre"
                            id="titre"
                            value={formState.titre}
                            onChange={handleInputChange}
                            placeholder="Titre"

                        />
                        {errors.titre && <p className="error">{errors.titre}</p>}
                    </div>
                    {formState.type == "prestation" &&
                        <div className="form-tow">
                            <div className="form-group">
                                <label htmlFor="temps">Temps en minutes</label>
                                <input
                                    className="inputs"
                                    type="number"
                                    name="temps"
                                    id="temps"
                                    value={formState.temps}
                                    onChange={handleInputChange}
                                    placeholder="Temps en minutes (ex: 30)"
                                />
                                {errors.temps && <p className="error">{errors.temps}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="prix">Prix en euros</label>
                                <input
                                    className="inputs"
                                    type="number"
                                    name="prix"
                                    id="prix"
                                    value={formState.prix}
                                    onChange={handleInputChange}
                                    placeholder="Prix en euros"
                                />
                                {errors.prix && <p className="error">{errors.prix}</p>}
                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="btn-pro scnd" onClick={() => setActionType(null)} ><p>Retour</p></button>
                        <button className={actionType == 'deleting' ? "btn-pro danger " : "btn-pro"} type="submit"><p>{actionType == "editing" ? 'Modifier' : (actionType == "deleting" ? 'Supprimer' : 'Ajouter')}</p></button>
                    </div>
                </form>
            </Modal>
            <div className='center prestations'>
                <div className="tsave">
                    <h3>Prestations</h3>
                    <div className="actions">
                        <button className={btnSave ? "btn-pro scnd " : "btn-pro scnd off"} onClick={() => handleRetour()}> <p>Annuler</p></button>
                        <button className={btnSave ? "btn-pro  " : "btn-pro off"} onClick={() => handleSave()}> <p>Sauvegarder</p></button>
                    </div>
                </div>
                {dataPage ?
                    <div className="draglist">
                        <div className="actions">
                            <a className="btn-base" onClick={() => handleAdd('titre')} ><p>Ajouter un titre</p></a>
                            <a className="btn-base" onClick={() => handleAdd("prestation")}  ><p>Ajouter une prestation</p></a>
                        </div>
                        <ReactSortable className="list" list={prestations} setList={updatePositions} animation={200}
                            delayOnTouchStart={true}
                            delay={2}>
                            {prestations.map((item) => (
                                <div>
                                    {item.type == "titre" ?
                                        <div className="titre" key={item.id_prestation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.30769 1.11111C2.30769 1.4058 2.18613 1.68841 1.96974 1.89679C1.75335 2.10516 1.45987 2.22222 1.15385 2.22222C0.847827 2.22222 0.554342 2.10516 0.337954 1.89679C0.121566 1.68841 0 1.4058 0 1.11111C0 0.816426 0.121566 0.533811 0.337954 0.325437C0.554342 0.117063 0.847827 0 1.15385 0C1.45987 0 1.75335 0.117063 1.96974 0.325437C2.18613 0.533811 2.30769 0.816426 2.30769 1.11111ZM1.15385 6.11111C1.45987 6.11111 1.75335 5.99405 1.96974 5.78567C2.18613 5.5773 2.30769 5.29469 2.30769 5C2.30769 4.70532 2.18613 4.4227 1.96974 4.21433C1.75335 4.00595 1.45987 3.88889 1.15385 3.88889C0.847827 3.88889 0.554342 4.00595 0.337954 4.21433C0.121566 4.4227 0 4.70532 0 5C0 5.29469 0.121566 5.5773 0.337954 5.78567C0.554342 5.99405 0.847827 6.11111 1.15385 6.11111ZM1.15385 10C1.45987 10 1.75335 9.88294 1.96974 9.67456C2.18613 9.46619 2.30769 9.18357 2.30769 8.88889C2.30769 8.5942 2.18613 8.31159 1.96974 8.10322C1.75335 7.89484 1.45987 7.77778 1.15385 7.77778C0.847827 7.77778 0.554342 7.89484 0.337954 8.10322C0.121566 8.31159 0 8.5942 0 8.88889C0 9.18357 0.121566 9.46619 0.337954 9.67456C0.554342 9.88294 0.847827 10 1.15385 10ZM7.5 1.11111C7.5 1.4058 7.37843 1.68841 7.16205 1.89679C6.94566 2.10516 6.65217 2.22222 6.34615 2.22222C6.04013 2.22222 5.74665 2.10516 5.53026 1.89679C5.31387 1.68841 5.19231 1.4058 5.19231 1.11111C5.19231 0.816426 5.31387 0.533811 5.53026 0.325437C5.74665 0.117063 6.04013 0 6.34615 0C6.65217 0 6.94566 0.117063 7.16205 0.325437C7.37843 0.533811 7.5 0.816426 7.5 1.11111ZM6.34615 6.11111C6.65217 6.11111 6.94566 5.99405 7.16205 5.78567C7.37843 5.5773 7.5 5.29469 7.5 5C7.5 4.70532 7.37843 4.4227 7.16205 4.21433C6.94566 4.00595 6.65217 3.88889 6.34615 3.88889C6.04013 3.88889 5.74665 4.00595 5.53026 4.21433C5.31387 4.4227 5.19231 4.70532 5.19231 5C5.19231 5.29469 5.31387 5.5773 5.53026 5.78567C5.74665 5.99405 6.04013 6.11111 6.34615 6.11111ZM6.34615 10C6.65217 10 6.94566 9.88294 7.16205 9.67456C7.37843 9.46619 7.5 9.18357 7.5 8.88889C7.5 8.5942 7.37843 8.31159 7.16205 8.10322C6.94566 7.89484 6.65217 7.77778 6.34615 7.77778C6.04013 7.77778 5.74665 7.89484 5.53026 8.10322C5.31387 8.31159 5.19231 8.5942 5.19231 8.88889C5.19231 9.18357 5.31387 9.46619 5.53026 9.67456C5.74665 9.88294 6.04013 10 6.34615 10Z" fill="#787878" />
                                            </svg><p>{item.titre}</p>
                                            <a className="btn-base small" onClick={() => handleEdit(item)} ><p>Modifier</p> </a>
                                            <a className="btn-base danger" onClick={() => handleDelete(item)}> <p>Supprimer</p> </a></div>
                                        :
                                        <div className="presta" key={item.id_prestation}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.30769 1.11111C2.30769 1.4058 2.18613 1.68841 1.96974 1.89679C1.75335 2.10516 1.45987 2.22222 1.15385 2.22222C0.847827 2.22222 0.554342 2.10516 0.337954 1.89679C0.121566 1.68841 0 1.4058 0 1.11111C0 0.816426 0.121566 0.533811 0.337954 0.325437C0.554342 0.117063 0.847827 0 1.15385 0C1.45987 0 1.75335 0.117063 1.96974 0.325437C2.18613 0.533811 2.30769 0.816426 2.30769 1.11111ZM1.15385 6.11111C1.45987 6.11111 1.75335 5.99405 1.96974 5.78567C2.18613 5.5773 2.30769 5.29469 2.30769 5C2.30769 4.70532 2.18613 4.4227 1.96974 4.21433C1.75335 4.00595 1.45987 3.88889 1.15385 3.88889C0.847827 3.88889 0.554342 4.00595 0.337954 4.21433C0.121566 4.4227 0 4.70532 0 5C0 5.29469 0.121566 5.5773 0.337954 5.78567C0.554342 5.99405 0.847827 6.11111 1.15385 6.11111ZM1.15385 10C1.45987 10 1.75335 9.88294 1.96974 9.67456C2.18613 9.46619 2.30769 9.18357 2.30769 8.88889C2.30769 8.5942 2.18613 8.31159 1.96974 8.10322C1.75335 7.89484 1.45987 7.77778 1.15385 7.77778C0.847827 7.77778 0.554342 7.89484 0.337954 8.10322C0.121566 8.31159 0 8.5942 0 8.88889C0 9.18357 0.121566 9.46619 0.337954 9.67456C0.554342 9.88294 0.847827 10 1.15385 10ZM7.5 1.11111C7.5 1.4058 7.37843 1.68841 7.16205 1.89679C6.94566 2.10516 6.65217 2.22222 6.34615 2.22222C6.04013 2.22222 5.74665 2.10516 5.53026 1.89679C5.31387 1.68841 5.19231 1.4058 5.19231 1.11111C5.19231 0.816426 5.31387 0.533811 5.53026 0.325437C5.74665 0.117063 6.04013 0 6.34615 0C6.65217 0 6.94566 0.117063 7.16205 0.325437C7.37843 0.533811 7.5 0.816426 7.5 1.11111ZM6.34615 6.11111C6.65217 6.11111 6.94566 5.99405 7.16205 5.78567C7.37843 5.5773 7.5 5.29469 7.5 5C7.5 4.70532 7.37843 4.4227 7.16205 4.21433C6.94566 4.00595 6.65217 3.88889 6.34615 3.88889C6.04013 3.88889 5.74665 4.00595 5.53026 4.21433C5.31387 4.4227 5.19231 4.70532 5.19231 5C5.19231 5.29469 5.31387 5.5773 5.53026 5.78567C5.74665 5.99405 6.04013 6.11111 6.34615 6.11111ZM6.34615 10C6.65217 10 6.94566 9.88294 7.16205 9.67456C7.37843 9.46619 7.5 9.18357 7.5 8.88889C7.5 8.5942 7.37843 8.31159 7.16205 8.10322C6.94566 7.89484 6.65217 7.77778 6.34615 7.77778C6.04013 7.77778 5.74665 7.89484 5.53026 8.10322C5.31387 8.31159 5.19231 8.5942 5.19231 8.88889C5.19231 9.18357 5.31387 9.46619 5.53026 9.67456C5.74665 9.88294 6.04013 10 6.34615 10Z" fill="#787878" />
                                            </svg>
                                            <p className="nom">{item.titre}</p>
                                            <p className="temps">{item.temps + " minutes"}</p>
                                            <span className="verti" />
                                            <p className="prix">{item.prix + "€"}</p>
                                            <a className="btn-base small" onClick={() => handleEdit(item)}><p>Modifier</p> </a>
                                            <a className="btn-base danger" onClick={() => handleDelete(item)} > <p>Supprimer</p> </a>
                                        </div>
                                    } </div>
                            ))}
                        </ReactSortable>
                    </div>
                :
                <Loader/>
            }
            </div>
        </div>
    );
};

export default Prestations;