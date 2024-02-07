import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { startOfWeek, addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr);

const Datepicker = ({ onDateChange, dispo }) => {
    // Utiliser useEffect pour définir les dates initiales lors du montage du composant
    const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [endDate, setEndDate] = useState(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6));
    
    const previousStartDateRef = useRef();
    const previousEndDateRef = useRef();
  

    useEffect(() => {
        const areDatesDifferent = (date1, date2) => {
            return (!date1 && date2) || 
                   (!date2 && date1) || 
                   (date1 && date2 && (
                       date1.getDate() !== date2.getDate() ||
                       date1.getMonth() !== date2.getMonth() ||
                       date1.getFullYear() !== date2.getFullYear()
                   ));
        }

        // Vérifiez si les dates sont différentes avant d'appeler onDateChange
        if (onDateChange && 
            (areDatesDifferent(startDate, previousStartDateRef.current) ||
             areDatesDifferent(endDate, previousEndDateRef.current))) {
            onDateChange(startDate, endDate);
        }

        // Mettre à jour les références avec les nouvelles valeurs
        previousStartDateRef.current = startDate;
        previousEndDateRef.current = endDate;
    }, [startDate, endDate, onDateChange]);

    const onChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    };
  
    return (
      <DatePicker
        locale="fr"
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
    );
  };
  
  export default Datepicker;