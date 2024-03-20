import React from 'react';
import Hearderpro from '../../components/Hearderpro';
import Leftmenu from '../../components/LeftMenu';
import RdvList from '../../components/RdvList';
import RdvDisp from '../../components/RdvDisp';
import SousMenuPro from '../../components/Sousmenupro';
import Modal from "../../components/Modal";
import useFetch from '../../hooks/useFetch';

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

    const {data, loading, error} = useFetch('/rendezvous/' , 'GET' , null, true, true);

    
    return (
        <div className='page'>

            <Leftmenu />
            <div className='content accueilpro'>
                <Hearderpro titre="Accueil" />
                <div className='cont'>
                  
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