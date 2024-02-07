import React, { useState, useContext  } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import MapsApiContext from '../contexts/MapLoadContext';


const AddressAuto = ({ err, onAddressSelect, newSelect }) => {
    const [addressQuery, setAddressQuery] = useState(newSelect);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const isLoaded = useContext(MapsApiContext);

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: "AIzaSyB4cyH10yrG92SZSlOY9vNB3nKZByhvj_Q",
    //     libraries: ["places"] // Ajoutez ceci
    // })


    const handleSelect = async (value) => {
        setAddressQuery(value);
        try {
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
            onAddressSelect({ value, latLng }); // Vous pouvez envoyer d'autres informations si nécessaire
        } catch (error) {
            console.error('Error', error);
        }
    };

    // const handleFocus = () => {
    //     setShowSuggestions(true);
    // };

    // useEffect(() => {
    //     const fetchAddresses = async () => {
    //         const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&q=${addressQuery}`);
    //         const data = await response.json();
    //         setSuggestions(data);
    //     };

    //     if (addressQuery.length < 3) {
    //         setSuggestions([]);
    //         return;
    //     }
    //     else {
    //         fetchAddresses();
    //     }
    // }, [addressQuery]);

    // useEffect(() => {
    //     setAddressQuery(newSelect);
    //     setShowSuggestions(false); 
    // }, [newSelect]);

    return isLoaded ? (
        <div className="form-group">
            <label htmlFor="adresse">Adresse</label>
            <PlacesAutocomplete
                value={addressQuery}
                onChange={setAddressQuery}
                onSelect={handleSelect}
                searchOptions={{ componentRestrictions: { country: ['fr'] } }}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="form-group">
                        <input {...getInputProps({ placeholder: 'Adresse', className: 'inputs' })} />

                        {suggestions.length < 1 ? null :
                            <div className="listad">
                                <ul>
                                    {suggestions.map(suggestion => (
                                        <li {...getSuggestionItemProps(suggestion, { className: 'suggestion-item' })}>
                                            {suggestion.description}
                                        </li>))}
                                </ul>

                            </div>
                        }

                        {err && <p className="error">{err}</p>}

                    </div>
                )}
            </PlacesAutocomplete>
        </div>
    ) : <></>
};

export default AddressAuto;