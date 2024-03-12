import React, { useState } from "react";
import { useAlert } from '../contexts/AlertContext';




const Alert = ({ active, children }) => {

    const { isAlertOpen, alertContent, alertType, closeAlert } = useAlert();

    return (

        <div className={active || isAlertOpen ? !alertType ? "alerttop open alert" : "alerttop open" : "alerttop closed"}>
            {active || isAlertOpen ?
                alertType ?
                    <div className='alert-content'>
                        <div className="txt">
                            <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8.5" cy="8.5" r="8.5" fill="url(#paint0_linear_1227_2116)" />
                                <path d="M6.73524 10.5764L4.32548 8.34194L3.50488 9.09747L6.73524 12.0928L13.6698 5.66276L12.855 4.90723L6.73524 10.5764Z" fill="white" />
                                <defs>
                                    <linearGradient id="paint0_linear_1227_2116" x1="8.5" y1="0" x2="8.5" y2="17" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#25AAA5" />
                                        <stop offset="1" stop-color="#006963" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <p>{alertContent}</p>
                            {active && children}

                        </div>

                        <div>
                            <button className="btn-base" onClick={closeAlert}> <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14.5L0 13.1L5.6 7.5L0 1.9L1.4 0.5L7 6.1L12.6 0.5L14 1.9L8.4 7.5L14 13.1L12.6 14.5L7 8.9L1.4 14.5Z" fill="black" />
                            </svg></button>
                        </div>
                    </div>
                    :
                    <div className='alert-content'>
                        <div className="txt">
                            <svg  viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9.5" cy="9.5" r="9.5" fill="#FF5E00" />
                                <path d="M9.88412 4.22228L9.88412 11.899L8.70462 11.899L8.70462 4.22228L9.88412 4.22228ZM9.28438 13.1785C9.51428 13.1785 9.71253 13.2568 9.87913 13.4134C10.0424 13.57 10.124 13.7583 10.124 13.9782C10.124 14.1981 10.0424 14.3863 9.87913 14.5429C9.71253 14.6995 9.51428 14.7778 9.28438 14.7778C9.05447 14.7778 8.85789 14.6995 8.69463 14.5429C8.52803 14.3863 8.44473 14.1981 8.44473 13.9782C8.44473 13.7583 8.52803 13.57 8.69463 13.4134C8.85789 13.2568 9.05447 13.1785 9.28438 13.1785Z" fill="white" />
                            </svg>
                            <p>{alertContent}</p>
                            {active && children}
                        </div>
                        <div>
                            <button className="btn-base" onClick={closeAlert}> <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14.5L0 13.1L5.6 7.5L0 1.9L1.4 0.5L7 6.1L12.6 0.5L14 1.9L8.4 7.5L14 13.1L12.6 14.5L7 8.9L1.4 14.5Z" fill="black" />
                            </svg></button>
                        </div>

                    </div>
                : null}


        </div>
    );
};

export default Alert;