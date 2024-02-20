import React from 'react';
import Hearderpro from '../../components/Hearderpro';
import Leftmenu from '../../components/LeftMenu';
import RdvList from '../../components/RdvList';
import RdvDisp from '../../components/RdvDisp';
import SousMenuPro from '../../components/Sousmenupro';
import Modal from "../../components/Modal";

const Accueilpro = () => {



    const pro =
    {
        id: 1,
        nom: "Jean Dupont Coiffure",
        fonctions: ["Coiffeur", "Barbier"],
        ville: "Paris",
        numero: "0682 50 50 50",
        profile: "http://localhost:3000/static/media/img2.f843986badb263b19dc9.jpeg",
        images: ["http://localhost:3000/static/media/img2.f843986badb263b19dc9.jpeg", "http://localhost:3000/static/media/imgcoiffeur1.d22a5164ae8843802330.jpeg", "http://localhost:3000/static/media/img2.f843986badb263b19dc9.jpeg", "http://localhost:3000/static/media/imgcoiffeur1.d22a5164ae8843802330.jpeg", "http://localhost:3000/static/media/img2.f843986badb263b19dc9.jpeg"],
        coordonnees: { lat: 48.8566, lng: 2.3522 },
        distance: "5,7",
        evaluations: {
            global: 4.8,
            disponibilite: 4.8,
            ponctualite: 4.8,
            qualiteService: 4.8,
            relationnel: 4.8,
            experienceClient: 4.8,
            prix: 4.8
        },
    };

    return (
        <div className='page'>

            <Leftmenu />
            <div className='content accueilpro'>
                <Hearderpro titre="Accueil" />
                <div className='cont'>
                    <h1>Bonjour Jean Robert, </h1>
                    <div className="notifsac">
                        <div className="item alert">
                            <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9.5" cy="9.5" r="9.5" fill="#FF5E00" />
                                <path d="M9.88412 4.22228L9.88412 11.899L8.70462 11.899L8.70462 4.22228L9.88412 4.22228ZM9.28438 13.1785C9.51428 13.1785 9.71253 13.2568 9.87913 13.4134C10.0424 13.57 10.124 13.7583 10.124 13.9782C10.124 14.1981 10.0424 14.3863 9.87913 14.5429C9.71253 14.6995 9.51428 14.7778 9.28438 14.7778C9.05447 14.7778 8.85789 14.6995 8.69463 14.5429C8.52803 14.3863 8.44473 14.1981 8.44473 13.9782C8.44473 13.7583 8.52803 13.57 8.69463 13.4134C8.85789 13.2568 9.05447 13.1785 9.28438 13.1785Z" fill="white" />
                            </svg>
                            <p>Vous avez 15 nouvelles réservations à confirmer</p>
                        </div>
                        <div className="item alert">
                            <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9.5" cy="9.5" r="9.5" fill="#FF5E00" />
                                <path d="M9.88412 4.22228L9.88412 11.899L8.70462 11.899L8.70462 4.22228L9.88412 4.22228ZM9.28438 13.1785C9.51428 13.1785 9.71253 13.2568 9.87913 13.4134C10.0424 13.57 10.124 13.7583 10.124 13.9782C10.124 14.1981 10.0424 14.3863 9.87913 14.5429C9.71253 14.6995 9.51428 14.7778 9.28438 14.7778C9.05447 14.7778 8.85789 14.6995 8.69463 14.5429C8.52803 14.3863 8.44473 14.1981 8.44473 13.9782C8.44473 13.7583 8.52803 13.57 8.69463 13.4134C8.85789 13.2568 9.05447 13.1785 9.28438 13.1785Z" fill="white" />
                            </svg>
                            <p>vous n 'avez pas choisi votre médiateur</p>
                        </div>
                        <div className="item">
                            <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8.5" cy="8.5" r="8.5" fill="url(#paint0_linear_806_2116)" />
                                <path d="M6.73524 10.5764L4.32548 8.34194L3.50488 9.09747L6.73524 12.0928L13.6698 5.66276L12.855 4.90723L6.73524 10.5764Z" fill="white" />
                                <defs>
                                    <linearGradient id="paint0_linear_806_2116" x1="8.5" y1="0" x2="8.5" y2="17" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#25AAA5" />
                                        <stop offset="1" stop-color="#006963" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <p>Vous avez mis à jour votre profil</p>
                        </div>
                    </div>
                    <div className='disp'>
                        <div className='list'>
                            <h3>À confirmer</h3>
                            <RdvList typeList={"nouveaux"}></RdvList>
                        </div>
                        <div className='list'>
                            <h3>Aujourd'hui</h3>
                            <RdvList typeList={""}></RdvList>
                        </div>
                        <div className='list'>
                            <div className='end'>
                                <h3>En cours</h3>
                                 <RdvDisp type={"action"} iopen={true} idrdv={3} />

                               
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </div>
    );
};

export default Accueilpro;