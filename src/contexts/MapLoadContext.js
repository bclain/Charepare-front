import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const MapsApiContext = React.createContext();


export const MapsLoadProvider = ({ children }) =>{
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyB4cyH10yrG92SZSlOY9vNB3nKZByhvj_Q",
        libraries: ["places", "maps"]// Ajoutez ceci
    })  

  return (
    <MapsApiContext.Provider value={isLoaded}>
      {children}
    </MapsApiContext.Provider>
    );
}

export default MapsApiContext;
