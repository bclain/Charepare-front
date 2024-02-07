import React, { useEffect, useState } from 'react';
import DateSelect from './DateSelect';
import useFetch from '../hooks/useFetch';

const NouvRdv = ({ horaires: idcoiffeur, presta: prestas }) => {

    const { data: horairesdata, loading, error } = useFetch(`/horaires/?filters[pro][$eq]=${idcoiffeur}&populate=*`, 'GET', null, true, true);
    
    const [horaires, setHoraires] = useState(null);
    const [idpresta, setIdpresta] = useState({});
    const [interval, setInterval] = useState(40);
    const [dureeRdv, setDureeRdv] = useState(10);
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        if(horairesdata && horairesdata[0])
        setHoraires(horairesdata[0].attributes?.details);
     }, [horairesdata]);

     useEffect(() => {
        console.log("prestas")
        if (prestas && prestas.length > 0) {
            let totalTemps = 0;

            // Parcourir chaque prestation et additionner son temps au total
            prestas.forEach(presta => {
                totalTemps += presta.temps * presta.quantite; // Assurez-vous que `presta.temps` est un nombre
            });
    
            // Mise à jour du temps total des prestations
            setDureeRdv(totalTemps);
            const newIdPresta = {};
            prestas.forEach(presta => {
                newIdPresta[presta.id_prestation] = true; // ou toute autre valeur pertinente
            });
            setIdpresta(newIdPresta);
        }
    }, [prestas]);

    useEffect(() => {
        console.log(dureeRdv);
    }, [dureeRdv]); // Le tableau vide indique que cet effet ne s'exécute qu'une fois, au montage du composant


    return (
        <div className='priseRdv'>
            {horaires &&
            <DateSelect horaires={horaires} interval={interval} dureeRdv={dureeRdv}  result={(e)=>setSelectedDate(e)} >

            </DateSelect>
            }
            <btn class={ selectedDate ? "btn-front spe" :  "btn-front spe inactive"  } ><span></span><p>Continuer</p><div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.8795 15.2253L4.96384 14.1724L4.9639 14.1724L7.88392 11.3369L7.88395 11.3369L11.1798 8.13634L11.2394 8.13634L11.2096 8.10744L11.2396 8.07835L11.1796 8.07835L8.29688 5.27897L8.29701 5.27885L6.79983 3.82497L6.79933 3.82497L5.37661 2.4434L5.37675 2.44328L3.87956 0.989401L0.162947 0.9894L3.10546 3.8468L3.10533 3.84693L4.60252 5.30081L4.60301 5.30081L6.02569 6.68233L6.02556 6.68246L7.49299 8.10744L6.61576 8.9593L6.61573 8.95927L3.51856 11.9669L3.5185 11.9668L0.162881 15.2253L3.8795 15.2253Z" fill="#006963"></path></svg></div></btn>

            
        </div>
    );
};

export default NouvRdv;