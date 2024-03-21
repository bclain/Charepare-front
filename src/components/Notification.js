import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilitySensor from 'react-visibility-sensor';
const { useModal } = require('../contexts/ModalContext');




const Notification = ({id, type, texte, lien, vu, ind }) => {
    const [activeVisible, setActiveVisible] = useState(false);

    const navigate = useNavigate();


    const {  closeNotif } = useModal();

    const navigatecardlink = () => {
        console.log('lien', lien);  
        navigate(lien);
        closeNotif()
    }



    const onChange = (isVisible) => {
        console.log('ind',(ind[1] - 2), ind,  ind[1] - 2 === ind[0]);
        if (!activeVisible) {
            setActiveVisible(true)
        }
        else {
            if (isVisible && ind[1] - 2 === ind[0]) {
                vu(true);
            }
        }
    };

    return (
        <div onClick={()=> lien &&  navigatecardlink() } class={type ? lien ?  "link itemnotif" :  "itemnotif" : lien ?  "link itemnotif alert" : "itemnotif alert"}  >
            {type ?
                <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="8.5" fill="url(#paint0_linear_806_2116)"></circle><path d="M6.73524 10.5764L4.32548 8.34194L3.50488 9.09747L6.73524 12.0928L13.6698 5.66276L12.855 4.90723L6.73524 10.5764Z" fill="white"></path><defs><linearGradient id="paint0_linear_806_2116" x1="8.5" y1="0" x2="8.5" y2="17" gradientUnits="userSpaceOnUse"><stop stop-color="#25AAA5"></stop><stop offset="1" stop-color="#006963"></stop></linearGradient></defs></svg>
                :
                <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9.5" cy="9.5" r="9.5" fill="url(#paint0_linear_1358_3038)" />
                    <path d="M9.88412 4.22228L9.88412 11.899L8.70462 11.899L8.70462 4.22228L9.88412 4.22228ZM9.28438 13.1785C9.51428 13.1785 9.71253 13.2568 9.87913 13.4134C10.0424 13.57 10.124 13.7583 10.124 13.9782C10.124 14.1981 10.0424 14.3863 9.87913 14.5429C9.71253 14.6995 9.51428 14.7778 9.28438 14.7778C9.05447 14.7778 8.85789 14.6995 8.69463 14.5429C8.52803 14.3863 8.44473 14.1981 8.44473 13.9782C8.44473 13.7583 8.52803 13.57 8.69463 13.4134C8.85789 13.2568 9.05447 13.1785 9.28438 13.1785Z" fill="white" />
                    <defs>
                        <linearGradient id="paint0_linear_1358_3038" x1="9.5" y1="0" x2="16" y2="15.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF5E00" />
                            <stop offset="1" stop-color="#602400" />
                        </linearGradient>
                    </defs>
                </svg>

            }

        <VisibilitySensor onChange={onChange}><p>{texte}</p></VisibilitySensor>
        </div>
    );
};

export default Notification;