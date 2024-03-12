import React, { useEffect, useState } from 'react';
import DateSelect from './DateSelect';
import useFetch from '../hooks/useFetch';
import StepsIndicator from './StepsIndicator';
import AddressAuto from './AddressAuto';
import { useAuth } from '../contexts/AuthContext';
import DOMPurify from 'dompurify';
import validator from 'validator';
import Loader from './Loader';
import Switch from './Switch';
import { useModal } from '../contexts/ModalContext';
import LoginForm from './LoginForm';    // Import the `useAuth` hook   
import RegisterForm from './RegisterForm'; 

const NouvRdv = ({ horaires: idcoiffeur, presta: prestas, nresa, idpage}) => {

    const { isAuthenticated, userInfo, userId, getUserInfo } = useAuth();

    const [formState, setFormState] = useState({
        date: '',
        datefin: '',
        user: '',
        prestataire_page: '',
        presta_choisies: [],
        email: '',
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
        accepteConditions: false
    });
    const { openModal, closeModal } = useModal();

    const { data: horairesdata, loading: horaireloading } = useFetch(`/horaires/?filters[pro][$eq]=${idcoiffeur}&populate=*`, 'GET', null, true, true);
    const [currentStep, setCurrentStep] = useState(0)
    const [resa, setResa] = useState(false);
    const [horaires, setHoraires] = useState(null);
    const [idpresta, setIdpresta] = useState({});
    const [interval, setInterval] = useState(40);
    const [dureeRdv, setDureeRdv] = useState(10);
    const [submitData, setSubmitData] = useState(null);
    const [sendSubmit, setSendSubmit] = useState(false);
    const [sendLogin, setSendLogin] = useState(false);
    const [sendRegister, setSendRegister] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [addPresta, setAddPresta] = useState(false);
    const stesps = ["Réservation", "Informations", "Confirmation"];
    const [prestationsSelectionnees, setPrestationsSelectionnees] = useState([]); // État pour les prestations sélectionnées
    const [errors, setErrors] = useState({});
    const { data: nrdv, loading, error: nerror } = useFetch(`/rdvs`, 'POST', submitData, true, sendSubmit);
    const switchItems = [
        { id: 'register', label: 'Inscription' },
        { id: 'login', label: 'Connexion' },
    ];
    const [activeSwItem, setActiveSwItem] = useState('register');

    useEffect(() => {
        if (horairesdata && horairesdata[0])
            setHoraires(horairesdata[0].attributes?.details);
    }, [horairesdata]);

    
    const ajouterPrestationSelectionnee = (prestationAjoutee) => {
        setResa(true);
        nresa(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // Créer un nouveau tableau à partir de l'état précédent
        const nouvelleListe = [...prestationsSelectionnees];

        // Si la prestation n'existe pas, l'ajouter avec une quantité initialisée à 1
        nouvelleListe.push({ ...prestationAjoutee, quantite: 1 });


        setAddPresta(false);
        setPrestationsSelectionnees(nouvelleListe);
    };

    useEffect(() => {
        if (userInfo) {
            // Création d'un nouvel objet avec les données mises à jour
            const updatedFormState = {
                ...formState, // Conserve les valeurs existantes de formState
                email: userInfo.email || '',
                user: userInfo.id || '',
                nom: userInfo.nom || '',
                prenom: userInfo.prenom || '',
                adresse: userInfo.adresse ? userInfo.adresse.value : '',
                telephone: userInfo.telephone || '',
                // Ajoutez ici d'autres champs si nécessaire
            };
            // Mise à jour de l'état formState avec le nouvel objet
            setFormState(updatedFormState);
        }
    }, [userInfo]);

    useEffect(() => {
        if (nrdv) {
            setFormState({
                email: nrdv.email,
                user: nrdv.id,
                nom: nrdv.nom,
                prenom: nrdv.prenom,
                adresse: nrdv.adresse,
                telephone: nrdv.telephone,
                accepteConditions: false
            });
            setCurrentStep(currentStep + 1);
            setSendSubmit(false);
        }
        else if (nerror) {
            setCurrentStep(currentStep + 1);
            setSendSubmit(false);
        }
    }, [nrdv, nerror]);

    const retour = () => {
        setPrestationsSelectionnees([]);
        setAddPresta(false);
        setResa(false);
        nresa(false);
        setCurrentStep(0);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        console.log("fooorm", formState);
    }, [formState]);


    useEffect(() => {
        if (prestationsSelectionnees && prestationsSelectionnees.length > 0) {
            let totalTemps = 0;

            // Parcourir chaque prestation et additionner son temps au total
            prestationsSelectionnees.forEach(presta => {
                totalTemps += presta.temps * presta.quantite; // Assurez-vous que `presta.temps` est un nombre
            });

            // Mise à jour du temps total des prestations
            setDureeRdv(totalTemps);
            const newIdPresta = {};
            prestationsSelectionnees.forEach(presta => {
                newIdPresta[presta.id_prestation] = true; // ou toute autre valeur pertinente
            });
            setIdpresta(newIdPresta);
        }
    }, [prestationsSelectionnees]);
// Le tableau vide indique que cet effet ne s'exécute qu'une fois, au montage du composant

    const reduirPrestationSelectionnee = (idPrestationASupprimer) => {

        const index = prestationsSelectionnees.findIndex(prestation => prestation.id_prestation === idPrestationASupprimer);

        if (index !== -1) {
            // Copie de l'état actuel pour éviter la mutation directe
            const nouvelleListe = [...prestationsSelectionnees];


            nouvelleListe.splice(index, 1);
            setPrestationsSelectionnees(nouvelleListe);
            if (nouvelleListe.length < 1) {
                setResa(false);
                nresa(false);
                setAddPresta(false);
            }

        }


    };

    //make a handlesuivant function to handle the next step
    const handlesuivant = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if (selectedDate && currentStep === 0) {
            formState.date = selectedDate.date
            formState.datefin = selectedDate.datefin
            formState.user = userId
            formState.prestataire_page = idcoiffeur
            formState.presta_choisies =  JSON.stringify(prestationsSelectionnees);
            setCurrentStep(currentStep + 1);
            if (userInfo) {
                // Création d'un nouvel objet avec les données mises à jour
                const nusernfo = getUserInfo();
                const updatedFormState = {
                    ...formState, // Conserve les valeurs existantes de formState
                    email: userInfo.email || '',
                    user: userInfo.id || '',
                    nom: userInfo.nom || '',
                    prenom: userInfo.prenom || '',
                    adresse: userInfo.adresse ? userInfo.adresse.value : '',
                    telephone: userInfo.telephone || '',
                    // Ajoutez ici d'autres champs si nécessaire
                };
                // Mise à jour de l'état formState avec le nouvel objet
                setFormState(updatedFormState);}
        }
        else if (currentStep === 1) {
            handleSubmit();
        }
    };


    const validateFields = () => {
        let newErrors = {};
        let isValid = true;

        // Email validation et sanitation
        if (!formState.email) {
            newErrors.email = "L'email est requis.";
            isValid = false;
        } else if (!validator.isEmail(formState.email)) {
            newErrors.email = "L'adresse email est invalide.";
            isValid = false;
        } else {
            formState.email = validator.normalizeEmail(formState.email);
        }


        // Nom et Prénom sanitation (simple exemple, peut être étendu/adapté)
        ['nom', 'prenom'].forEach(field => {
            if (!formState[field]) {
                newErrors[field] = `Le ${field} est requis.`;
                isValid = false;
            } else {
                formState[field] = validator.escape(formState[field]);
            }
        });

        // Adresse sanitation
        if (!formState.adresse) {
            newErrors.adresse = "L'adresse est requise.";
            isValid = false;
        } else {
            formState.adresse = formState.adresse.value;
        }

        // Téléphone validation
        if (!formState.telephone) {
            newErrors.telephone = "Le numéro de téléphone est requis.";
            isValid = false;
        } else if (!validator.isMobilePhone(formState.telephone, 'any', { strictMode: false })) {
            newErrors.telephone = "Le numéro de téléphone est invalide.";
            isValid = false;
        }

        // Conditions validation
        if (!formState.accepteConditions) {
            newErrors.accepteConditions = "Vous devez accepter les conditions générales.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const sanitizeInput = (input) => {
        const sanitizedInput = DOMPurify.sanitize(input);
        return sanitizedInput;
    };

    const handleSubmit = () => {
        if (validateFields()) {
            const formData = new FormData();
            const sanitizedFormState = {};
            



            for (const key in formState) {
                sanitizedFormState[key] = sanitizeInput(formState[key]);
            }

            
            // Submit the form
            formData.append('data', JSON.stringify(sanitizedFormState));
            


            setSubmitData(formData);
            setSendSubmit(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const sanitizedValue = sanitizeInput(value);
        setFormState({
            ...formState,
            [name]: type === 'checkbox' ? checked : sanitizedValue
        });
    };

    return (
        <div className='priseRdv'>
            {!resa ?
                <div className="prestations">
                    <h4>Prestations</h4>
                    <ul className={addPresta ? "add open" : "add"}>
                        {prestas.map((item) => (
                            <div>
                                {item.type === "titre" ?
                                    <div className="titre" key={item.id_prestation}>
                                        <p className='desc'>{item.titre}</p>
                                    </div>
                                    :
                                    <div className="presta borderpro" key={item.id_prestation} onClick={() => ajouterPrestationSelectionnee(item)}>
                                        <p className="nom">{item.data}</p>
                                        <p className="temps">{item.temps + " minutes"}</p>
                                        <span className="verti" />
                                        <p className="prix">{item.prix + "€"}</p>
                                        <button class="btn-front">
                                            <p>Reserver</p>
                                            <svg viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.57217 11.4584L4.34017 10.6273L4.34019 10.6273L5.64057 9.22001L5.64063 9.22001L6.70122 8.07226L6.70119 8.07224L6.7171 8.05502L6.71705 8.05502L8.74258 5.86304L8.78719 5.86128L8.764 5.83986L8.78577 5.8163L8.74044 5.81809L6.54896 3.79303L6.54901 3.79303L4.29305 1.70839L4.29321 1.70822L3.14557 0.647732L0.404774 0.755908L2.64338 2.82451L2.64297 2.82453L5.2151 5.20133L5.21512 5.20131L6.02321 5.94803L4.98423 7.07239L4.98429 7.07243L3.97636 8.1632L3.9763 8.1632L3.20814 8.99449L3.20812 8.99448L0.831372 11.5665L3.57217 11.4584Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                } </div>
                        ))}
                    </ul>
                </div>
                :
                <div className='priseRdv'>
                    <div className='formheader'>
                        <button class="btn-base " onClick={() => retour()}><svg
                            viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.36555 0.0634767L6.31252 1.11651L6.31239 1.11637L3.47689 3.95187L3.47685 3.95183L0.276298 7.15238H0.218262L0.24728 7.1814L0.218295 7.21039H0.276266L3.07575 10.0099L3.07572 10.0099L4.5296 11.4638H4.52993L5.91158 12.8454L5.91154 12.8455L7.36541 14.2993L10.9745 14.2993L8.11701 11.4418L8.11705 11.4418L6.66317 9.98791H6.66284L5.28122 8.60629L5.28125 8.60626L3.85639 7.1814L4.7083 6.32949L4.70834 6.32953L7.71597 3.3219L7.7161 3.32203L10.9747 0.0634766L7.36555 0.0634767Z" fill="#006963"></path></svg>
                            <p>Retour</p>
                        </button>
                        <StepsIndicator steps={stesps} currentStep={currentStep}></StepsIndicator>

                    </div>

                    {currentStep === 2 &&
                        <div className='confirmation'>
                            {nrdv ?
                                <div className='illu'>
                                    <svg viewBox="0 0 55 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="27.5" cy="28" r="27.5" fill="url(#paint0_linear_200_1731)" />
                                        <path d="M21.791 34.7176L13.9947 27.4885L11.3398 29.9329L21.791 39.6236L44.2264 18.8206L41.5903 16.3762L21.791 34.7176Z" fill="white" />
                                        <defs>
                                            <linearGradient id="paint0_linear_200_1731" x1="27.5" y1="0.5" x2="27.5" y2="55.5" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#25AAA5" />
                                                <stop offset="1" stop-color="#006963" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="txt">


                                        <h4>Félicitation!</h4>
                                        <p className='strong'>Votre réservation à été transmise avec succés.</p>
                                    </div>


                                </div> :
                                <div className='illu alert'>
                                    <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="9.5" cy="9.5" r="9.5" fill="#FF5E00" />
                                        <path d="M9.88412 4.22228L9.88412 11.899L8.70462 11.899L8.70462 4.22228L9.88412 4.22228ZM9.28438 13.1785C9.51428 13.1785 9.71253 13.2568 9.87913 13.4134C10.0424 13.57 10.124 13.7583 10.124 13.9782C10.124 14.1981 10.0424 14.3863 9.87913 14.5429C9.71253 14.6995 9.51428 14.7778 9.28438 14.7778C9.05447 14.7778 8.85789 14.6995 8.69463 14.5429C8.52803 14.3863 8.44473 14.1981 8.44473 13.9782C8.44473 13.7583 8.52803 13.57 8.69463 13.4134C8.85789 13.2568 9.05447 13.1785 9.28438 13.1785Z" fill="white" />
                                    </svg>
                                    <div className="txt">


                                        <h4>Une erreur s'est produite.</h4>
                                        <p className='strong'> Veuillez réessayer plus tard.</p>
                                    </div>


                                </div>
                            }

                        </div>
                    }

                    <div className={currentStep === 0 ? "prestations itemresa" : "prestations itemresa small"}>
                        <h4>Prestations {resa ? "choisies" : " "}</h4>

                        <ul>
                            {prestationsSelectionnees?.map((item) => (
                                <div>

                                    <div className="presta select borderpro" key={item.id_prestation} >
                                        <div className="nom"> <p>{item.titre}</p></div>
                                        <p className="temps">{item.temps + " minutes"}</p>
                                        <span className="verti" />
                                        <p className="prix">{(item.prix * item.quantite) + "€"}</p>
                                        {currentStep === 0 &&
                                            <button class="btn-base danger" onClick={() => reduirPrestationSelectionnee(item.id_prestation)}><p>Supprimer</p>
                                            </button>}
                                    </div>
                                </div>
                            ))}
                        </ul>
                        {currentStep === 0 ?
                            <div className=''>
                                <button className={addPresta ? "btn-base open" : "btn-base"} onClick={() => addPresta ? setAddPresta(false) : setAddPresta(true)}>
                                    <p>Ajouter un service</p>
                                    <svg viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.3497e-07 3.99334L1.05303 5.04637L1.0529 5.0465L3.8884 7.882L3.88836 7.88204L7.08891 11.0826L7.08891 11.1406L7.11793 11.1116L7.14691 11.1406L7.14691 11.0826L9.94639 8.28314L9.94642 8.28317L11.4003 6.82929L11.4003 6.82896L12.782 5.44731L12.782 5.44735L14.2359 3.99347L14.2359 0.384364L11.3784 3.24188L11.3783 3.24184L9.92444 4.69571L9.92444 4.69605L8.54281 6.07767L8.54279 6.07764L7.11793 7.5025L6.26602 6.65059L6.26605 6.65055L3.25842 3.64292L3.25855 3.64278L1.28269e-07 0.384229L2.3497e-07 3.99334Z" fill="#006963" />
                                    </svg>
                                </button>
                                <ul className={addPresta ? "add open" : "add"}>
                                    {prestas.map((item) => (
                                        <div>
                                            {item.type === "titre" ?
                                                <div className="titre" key={item.id_prestation}><p className='desc'>{item.titre}</p>
                                                </div>
                                                :
                                                <div className="presta borderpro" key={item.id_prestation} onClick={() => ajouterPrestationSelectionnee(item)}>
                                                    <p className="nom">{item.titre}</p>
                                                    <p className="temps">{item.temps + " minutes"}</p>
                                                    <span className="verti" />
                                                    <p className="prix">{item.prix + "€"}</p>
                                                    <button class="btn-front"><p>Reserver</p>
                                                        <svg viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.57217 11.4584L4.34017 10.6273L4.34019 10.6273L5.64057 9.22001L5.64063 9.22001L6.70122 8.07226L6.70119 8.07224L6.7171 8.05502L6.71705 8.05502L8.74258 5.86304L8.78719 5.86128L8.764 5.83986L8.78577 5.8163L8.74044 5.81809L6.54896 3.79303L6.54901 3.79303L4.29305 1.70839L4.29321 1.70822L3.14557 0.647732L0.404774 0.755908L2.64338 2.82451L2.64297 2.82453L5.2151 5.20133L5.21512 5.20131L6.02321 5.94803L4.98423 7.07239L4.98429 7.07243L3.97636 8.1632L3.9763 8.1632L3.20814 8.99449L3.20812 8.99448L0.831372 11.5665L3.57217 11.4584Z" fill="white" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            } </div>
                                    ))}
                                </ul>
                            </div>
                            : null}

                    </div>
                    <span />
                    <div className={currentStep === 0 ? "itemresa" : "itemresa small"}>
                        {horaires &&
                            <DateSelect prestatairepage={idpage} horaires={horaires} interval={interval} dureeRdv={dureeRdv} result={(e) => setSelectedDate(e)} edit={currentStep === 0 ? true : false} >
                            </DateSelect>
                        }
                    </div>
                    <span />
                    {currentStep === 1 && selectedDate &&(
                        isAuthenticated() && formState.adresse !==""  ?
                        <div className='form'>
                            <h4>Confimez vos informations </h4>
                            <AddressAuto err={errors.adresse ? errors.adresse : false} onAddressSelect={(address) => setFormState({ ...formState, adresse: address })} newSelect={formState.adresse} />
                            <div className="form-group line">
                                <label className='desc' htmlFor="prenom">Prénom</label>
                                <input
                                    type="text"
                                    className="inputs"
                                    name="prenom"
                                    value={formState.prenom}
                                    onChange={handleInputChange}
                                    placeholder="Prénom"
                                />
                                {errors.prenom && <p className="error">{errors.prenom}</p>}
                            </div>
                            <div className="form-group line">
                                <label className='desc' htmlFor="nom">Nom</label>
                                <input
                                    type="text"
                                    className="inputs"
                                    name="nom"
                                    value={formState.nom}
                                    onChange={handleInputChange}
                                    placeholder="Nom"
                                />
                                {errors.nom && <p className="error">{errors.nom}</p>}
                            </div>
                            <div className="form-group line">
                                <label className='desc' htmlFor="email">Adresse email</label>
                                <input
                                    type="email"
                                    className="inputs"
                                    name="email"
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                />
                                {errors.email && <p className="error">{errors.email}</p>}
                            </div>
                            <div className="form-group line">
                                <label className='desc' htmlFor="telephone">Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    className="inputs"
                                    name="telephone"
                                    value={formState.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Numéro de téléphone"
                                />
                                {errors.telephone && <p className="error">{errors.telephone}</p>}
                            </div>
                            <div className="form-group check">
                                <input
                                    type="checkbox"
                                    id="accepteConditions"
                                    name="accepteConditions"
                                    checked={formState.accepteConditions}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="accepteConditions">J’accepte les Conditions générales de ByKaHomes*</label>

                            </div>
                            {errors.accepteConditions && <p className="error">{errors.accepteConditions}</p>}
                            <p>Paiement avec le professionnel en personne: carte de crédit, espèces.  *</p>

                        </div>
                        :
                        <div className='connectsection form'>
                            {isAuthenticated() ?  <h4>Confimez vos informations  {formState.adresse} </h4> : <h4>Connectez-vous ou inscrivez-vous pour continuer</h4>}
                            <Switch items={switchItems} activeItem={activeSwItem} setActiveItem={(e) => setActiveSwItem(e)}></Switch>
                     {activeSwItem == "login" ?  <LoginForm send={true} action={sendLogin}></LoginForm> 
                     :
                            <RegisterForm send={true} action={sendRegister}></RegisterForm>    }        
                        </div>
                    )}
                    {currentStep === 2 && nrdv && formState.adresse !== ""  &&
                        <div className='confirmation'>
                            <div className="infos">
                                <div className='grp '>
                                    <p className='desc'>Nom:</p>
                                    <p className='strong'>{formState.nom}</p>
                                </div>
                                <div className='grp'>
                                    <p className='desc'>Prenom:</p>
                                    <p className='strong'>{formState.prenom}</p>
                                </div>
                                <div className='grp  '>
                                    <p className='desc'>Email:</p>
                                    <p className='strong'>{formState.email}</p>
                                </div>
                                <div className='grp  '>
                                    <p className='desc'>Téléphone:</p>
                                    <p className='strong'>{formState.telephone}</p>
                                </div>
                            </div>
                            <div className='grp'>
                                <p className='desc'>Adresse:</p>
                                <p className='strong'>{formState.adresse}</p>
                            </div>
                        </div>
                    }
                    {currentStep === 2 ?
                        <button class="btn-base " onClick={() => retour()}><svg
                            viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.36555 0.0634767L6.31252 1.11651L6.31239 1.11637L3.47689 3.95187L3.47685 3.95183L0.276298 7.15238H0.218262L0.24728 7.1814L0.218295 7.21039H0.276266L3.07575 10.0099L3.07572 10.0099L4.5296 11.4638H4.52993L5.91158 12.8454L5.91154 12.8455L7.36541 14.2993L10.9745 14.2993L8.11701 11.4418L8.11705 11.4418L6.66317 9.98791H6.66284L5.28122 8.60629L5.28125 8.60626L3.85639 7.1814L4.7083 6.32949L4.70834 6.32953L7.71597 3.3219L7.7161 3.32203L10.9747 0.0634766L7.36555 0.0634767Z" fill="#006963"></path></svg>
                            <p>Retour</p>
                        </button>
                        :
                        <btn class={ (currentStep === 0 && selectedDate )|| (currentStep === 1 && isAuthenticated() )? "btn-front spe" : "btn-front spe inactive"} onClick={handlesuivant}><span></span><p> {currentStep === 1 ? "Confirmer le rendez-vous" : "Continuer"}</p><div class="icon"> {loading ? <Loader type="button" ></Loader> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.8795 15.2253L4.96384 14.1724L4.9639 14.1724L7.88392 11.3369L7.88395 11.3369L11.1798 8.13634L11.2394 8.13634L11.2096 8.10744L11.2396 8.07835L11.1796 8.07835L8.29688 5.27897L8.29701 5.27885L6.79983 3.82497L6.79933 3.82497L5.37661 2.4434L5.37675 2.44328L3.87956 0.989401L0.162947 0.9894L3.10546 3.8468L3.10533 3.84693L4.60252 5.30081L4.60301 5.30081L6.02569 6.68233L6.02556 6.68246L7.49299 8.10744L6.61576 8.9593L6.61573 8.95927L3.51856 11.9669L3.5185 11.9668L0.162881 15.2253L3.8795 15.2253Z" fill="#006963"></path></svg>}</div></btn>
                    }
                </div>
            }
        </div>
    );
};

export default NouvRdv;