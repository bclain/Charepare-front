import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import AddressAuto from './AddressAuto';
import DOMPurify from 'dompurify';
import validator from 'validator';

const RegisterForm = ({ send, customInfos, action, type }) => {

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
        accepteConditions: false
    });

    useEffect(() => {
        const nInfos = formState
        if (customInfos) {
            if (customInfos.email) {
                nInfos.email = customInfos.email
            }
            if (customInfos.nom) {
                nInfos.nom = customInfos.nom
            }
            if (customInfos.prenom) {
                nInfos.prenom = customInfos.prenom
            }
            if (customInfos.adresse) {
                nInfos.adresse = customInfos.adresse
            }
            if (customInfos.telephone) {
                nInfos.telephone = customInfos.telephone
            }

        }
    }, [customInfos]);

    const { register } = useAuth();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});


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

        // Password validation
        if (!formState.password) {
            newErrors.password = "Le mot de passe est requis.";
            isValid = false;
        } else {
            let passwordError = "";
            if (formState.password.length < 8) {
                passwordError += "Le mot de passe doit contenir au moins 8 caractères. ";
            }
            if (!/\d/.test(formState.password)) {
                passwordError += "Le mot de passe doit contenir au moins un chiffre. ";
            }
            if (!/[!@#$%^&*]/.test(formState.password)) {
                passwordError += "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*). ";
            }
            if (formState.password !== formState.confirmPassword) {
                newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
                isValid = false;
            }
            if (passwordError) {
                newErrors.password = passwordError;
                isValid = false;
            }
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
        if (!formState.adresse && type === 1) {
            newErrors.adresse = "L'adresse est requise.";
            isValid = false;
        } else {
            formState.adresse = formState.adresse;
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
    // ...

    const sanitizeInput = (input) => {
        const sanitizedInput = DOMPurify.sanitize(input);
        return sanitizedInput;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const sanitizedValue = sanitizeInput(value);
        setFormState({
            ...formState,
            [name]: type === 'checkbox' ? checked : sanitizedValue
        });
    };

    // ...

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateFields()) {
            try {
                await register(formState.email, formState.password, formState.nom, formState.prenom, formState.adresse, formState.telephone);
                closeModal();
            } catch (error) {
                console.error("Erreur lors de l'inscription: ")
            }
        }
    };

    useEffect(() => {
        if (action) {
            handleSubmit();
        }
    }, [action]);



    return (
        <form>
            {!send &&
                <h3>Inscription</h3>
            }
            <div className="form-group line">
                <label htmlFor="prenom  line">Prénom</label>
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
                <label htmlFor="nom">Nom</label>
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
            <div className="form-group">
                <label htmlFor="email">Adresse email</label>
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
            <div className="form-group">
                <label htmlFor="telephone">Numéro de téléphone</label>
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

            {type !== 1 &&
                <AddressAuto err={errors.adresse ? errors.adresse : false} onAddressSelect={(address) => setFormState({ ...formState, adresse: address })} newSelect={formState.adresse} />
            }
            <div className="form-group line">
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    className="inputs"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    placeholder="Mot de passe"
                />
                <p className='desc'> ( Au moins 8 caractères, un chiffre et un caractère special )
                </p>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group line">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                    type="password"
                    className="inputs"
                    name="confirmPassword"
                    value={formState.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmer le mot de passe"
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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
            <div className="btns">
                {!send && <button className="btn-pro scnd " type='button' onClick={closeModal}><p>Retour</p></button>}
                <button className={type===1 ?'btn-pro full':'btn-pro' }   type="button" onClick={handleSubmit}><p>S'inscrire</p></button>
            </div>
        </form>
    );
};

export default RegisterForm;