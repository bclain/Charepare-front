import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import useFetch from '../hooks/useFetch';
import NouvRdv from '../components/NouvRdv';

const GaragePage = () => {

    const { data: pageData, loading: loadingPage, error: errorPage } = useFetch(`/pageGarages/1`, 'Get', null, true, true);
    const { data: servicesData, loading: servicesPage, error: errorServices } = useFetch(`/services/`, 'Get', null, true, true);
    const [resa, setResa] = useState(false);

    const prestationsTriees = servicesData
        ? servicesData.sort((a, b) => a.position - b.position)
        : [];
    if (loadingPage) return <div>Chargement...</div>;
    return (
        <div>
            
      <Navbar/>
      {pageData &&  
            <section>
                <div className="contentfront">
                    <div className='backgarage'>
                    <svg viewBox="0 0 1204 901" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M-0.00012207 -6.94418e-05L-7.34329e-05 1121H1204V-0.00012207L-0.00012207 -6.94418e-05ZM862.25 38.0224C844.636 33.3415 826.016 34.1124 808.85 40.2335L866.379 97.8104C873.412 105.092 877.304 114.844 877.216 124.967C877.128 135.09 873.067 144.773 865.909 151.931C858.75 159.089 849.066 163.15 838.943 163.238C828.819 163.326 819.066 159.434 811.784 152.402L754.203 94.8247C748.104 111.989 747.348 130.598 752.036 148.2C756.724 165.802 766.635 181.571 780.464 193.429C794.292 205.286 811.39 212.676 829.502 214.624C847.614 216.572 865.892 212.987 881.926 204.342L1157.6 480L1194 443.606L918.349 167.948C927.02 151.919 930.626 133.637 928.69 115.516C926.755 97.3948 919.368 80.2871 907.506 66.4515C895.643 52.616 879.863 42.7033 862.25 38.0224ZM1157.6 43.1935L1075.7 88.699L1066.59 134.204L1011.99 188.796L1048.41 225.19L1102.98 170.599L1148.49 161.487L1194 79.6133L1157.6 43.1935ZM939.198 334.398L902.776 298.004L766.276 434.495L764.268 436.734C760.187 441.886 758.232 448.403 758.803 454.951C759.374 461.498 762.428 467.579 767.339 471.947C772.25 476.314 778.646 478.638 785.216 478.441C791.786 478.245 798.031 475.542 802.672 470.889L939.198 334.398Z" fill="url(#paint0_linear_8_159)" fill-opacity="0.37"/>
                        <defs>
                        <linearGradient id="paint0_linear_8_159" x1="1167.28" y1="1.41758" x2="984.253" y2="660.85" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FEEAEA"/>
                        <stop offset="1" stop-opacity="0"/>
                        </linearGradient>
                        </defs>
                    </svg>

                    </div>
                    <div className='garagepage'>
                        <h1>{pageData.nom}</h1>
                        <div className="contacts">
                            <div className="contact">
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.9992 11.9289V15.072C13.9993 15.297 13.9247 15.5138 13.7905 15.6784C13.6562 15.843 13.4724 15.9434 13.2759 15.9591C12.9361 15.9858 12.6584 16 12.4438 16C5.57091 16 0 9.63289 0 1.77778C0 1.53244 0.011666 1.21511 0.0357758 0.826667C0.0495591 0.602172 0.137333 0.39201 0.281387 0.238586C0.425441 0.0851616 0.61505 -0.000101718 0.811955 2.28071e-07H3.56202C3.65849 -0.000111408 3.75156 0.0407636 3.82313 0.114685C3.89471 0.188606 3.93969 0.290296 3.94934 0.4C3.96722 0.604445 3.98356 0.767111 3.99911 0.890667C4.15367 2.12349 4.47042 3.32252 4.93861 4.44711C5.0125 4.62489 4.96428 4.83733 4.82429 4.95111L3.14594 6.32178C4.17212 9.05462 6.07764 11.2325 8.46875 12.4053L9.66646 10.4907C9.71542 10.4124 9.78684 10.3563 9.86828 10.3321C9.94972 10.3079 10.036 10.3172 10.1121 10.3582C11.0959 10.8924 12.1448 11.2535 13.223 11.4293C13.3311 11.4471 13.4735 11.4658 13.6508 11.4862C13.7466 11.4975 13.8354 11.549 13.8999 11.6307C13.9645 11.7125 13.9993 11.8188 13.9992 11.9289Z" fill="white" />
                                </svg>
                                <p>{pageData.telephone}</p>
                            </div>
                            <div className="contact">
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 9.5C6.33696 9.5 5.70107 9.23661 5.23223 8.76777C4.76339 8.29893 4.5 7.66304 4.5 7C4.5 6.33696 4.76339 5.70107 5.23223 5.23223C5.70107 4.76339 6.33696 4.5 7 4.5C7.66304 4.5 8.29893 4.76339 8.76777 5.23223C9.23661 5.70107 9.5 6.33696 9.5 7C9.5 7.3283 9.43534 7.65339 9.3097 7.95671C9.18406 8.26002 8.99991 8.53562 8.76777 8.76777C8.53562 8.99991 8.26002 9.18406 7.95671 9.3097C7.65339 9.43534 7.3283 9.5 7 9.5ZM7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 12.25 7 20 7 20C7 20 14 12.25 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0Z" fill="white" />
                                </svg>
                                <p>{pageData.adresse}</p>
                            </div>
                        </div>
                        <div className="presentation">
                            <p className='titre'>Présentation</p>
                            <p>Salut, je suis Jean Robert Coiffure, votre barbier à domicile dévoué.
                                Si vous recherchez une coupe de barbe impeccable, un style personnalisé et le confort de votre foyer, vous êtes au bon endroit. Avec ma passion pour la coiffure masculine, je m'engage à vous offrir une expérience de coiffure unique, adaptée à vos besoins.</p>
                        </div>
                        
                        {pageData?.id && prestationsTriees && (
                            <NouvRdv horaires={pageData?.id} presta={prestationsTriees} idpage={pageData?.id} nresa={(e) => setResa(e)} >

                            </NouvRdv>
                        )}
                        <div className="services">
                            <p className='titre'>Services</p>
                            <div className='service'>
                                <div className='nomService'> <p>Changement d'huile</p> </div>
                                <div className='serviceFin'>
                                    <div className='temps'>25min </div>
                                    <div className='ligne'>|</div>
                                    <div className='cout'>19 $</div>
                                    <div>
                                        <button className='btn-base'>
                                            <p>Réserver</p>
                                            <svg  viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.57249 11.4584L4.34049 10.6272L4.34051 10.6273L6.71742 8.05501L6.71709 8.05502L8.74258 5.86307L8.78719 5.86131L8.764 5.83989L8.78577 5.81633L8.74044 5.81812L6.54897 3.79306L6.54901 3.79306L4.29305 1.70842L4.29321 1.70825L3.14557 0.647763L0.404775 0.755939L2.64338 2.82454L2.64298 2.82456L5.2151 5.20136L5.21512 5.20134L6.02321 5.94806L4.98424 7.07242L4.98429 7.07247L2.89984 9.32822L2.90004 9.32821L0.831698 11.5665L3.57249 11.4584Z" fill="black" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </section>}
        </div>
    );
};

export default GaragePage;