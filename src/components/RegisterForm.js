import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import AddressAuto from './AddressAuto';

const RegisterForm = () => {

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
        adresse: '',
        prenom: '',
        adresse: '',
        telephone: '',
        accepteConditions: false
    });

    const { register } = useAuth();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState({
            ...formState,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateFields = () => {
        let newErrors = {};
        let isValid = true;

        // Email validation
        if (!formState.email) {
            newErrors.email = "L'email est requis.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
            newErrors.email = "L'adresse email est invalide.";
            isValid = false;
        }

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
        if (formState.password !== formState.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
            isValid = false;
        }

        // Nom validation
        if (!formState.nom) {
            newErrors.nom = "Le nom est requis.";
            isValid = false;
        }

        // Prénom validation
        if (!formState.prenom) {
            newErrors.prenom = "Le prénom est requis.";
            isValid = false;
        }

        // Adresse validation
        if (!formState.adresse) {
            newErrors.adresse = "L'adresse est requise.";
            isValid = false;
        }

        // Téléphone validation
        if (!formState.telephone) {
            newErrors.telephone = "Le numéro de téléphone est requis.";
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




    return (
        <form onSubmit={handleSubmit}>
            <h3>Inscription</h3>
            <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
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
            <div className="form-group">
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
            <div className="form-group">
                <label htmlFor="telephone">Adresse</label>
                <input
                    type="tel"
                    className="inputs"
                    name="adresse"
                    value={formState.adresse}
                    onChange={handleInputChange}
                    placeholder="Adresse"
                />
                {errors.adresse && <p className="error">{errors.adresse}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    className="inputs"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    placeholder="Mot de passe"
                />
                <p className='desc'> ( Au moins 8 caractères, un chiffre et un cactère special )
                </p>
                {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group">
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
                <button className="btn-pro scnd "  type='button' onClick={closeModal}><p>Retour</p></button>
                <button className='btn-pro' type="submit"><p>S'inscrire</p></button>
            </div>
        </form>
    );
};

export default RegisterForm;