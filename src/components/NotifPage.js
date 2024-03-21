import React, { useEffect, useState } from 'react';
import Switch from './Switch';
import RdvList from './RdvList';
import useFetch from '../hooks/useFetch';
import Notification from './Notification';
import VisibilitySensor from 'react-visibility-sensor';
import { useModal } from '../contexts/ModalContext'; 
import { set } from 'date-fns';

const NotifPage = () => {
    const [sendData, setSendData] = useState(false) ;
    const [pageNotif, setPageNotif] = useState(1);
    const [notifs, setNotifs] = useState([]);
    const { isNotifOpen, notifContent, closeNotif,setNbNotifs } = useModal();
    const { data: nNotifs, loading, error } = useFetch(`/notifications`, 'GET', null, true, sendData);
    const [activeVisible, setActiveVisible] = useState(false);

    const switchItems = [
        { id: 'notifs', label: 'Notifications' },
        { id: 'nouvrdv', label: 'Réservations' },
    ];
    const [activeSwItem, setActiveSwItem] = useState('notifs');

    useEffect(() => {
        if(isNotifOpen){
            setSendData(true);
            setNbNotifs(null);
        }
    }   ,[isNotifOpen]);
    

    useEffect(() => {   
        if(nNotifs && nNotifs[0]){
            setNotifs([...notifs, ...nNotifs]);
            setPageNotif(pageNotif + 1);
            if(nNotifs.length === 25) setSendData(false);
        } 
    },[nNotifs]);



    const handleNotifLoad = () => {
        console.log('load');
        setSendData(true);
    };


    return (
        <div className={isNotifOpen?'notifPage' :'notifPage nopen'} >
            <div className="back" onClick={closeNotif}></div>
            <div className="content">
                <div className="top">
                    <a onClick={closeNotif}>
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14.5" cy="14.5" r="14" stroke="black" />
                            <path d="M19.3337 9.66675L9.66699 19.3334M9.66699 9.66675L19.3337 19.3334" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a> 
                    <h3>Notifications</h3>
                </div>
                <Switch items={switchItems} activeItem={activeSwItem} setActiveItem={(e) => setActiveSwItem(e)}></Switch>
                {activeSwItem === 'notifs' ?
                <div className="notifList">
                    {notifs && notifs.map((notif, index) => (
                    <Notification key={index} id={notif.id} ind={[ index, notifs.length]} type={notif.attributes.type} texte={notif.attributes.message} lien={notif.attributes.link} vu={()=>handleNotifLoad()}></Notification>    
                   ) )}
                </div>
                :
                <RdvList typeList={"nouveaux"}></RdvList>}
            </div>

        </div>
    );
};

export default NotifPage;