import React, { useState, useEffect } from 'react';
import { makeRequest } from '../makeRequest';


const useFetch = (url, method, body, auth, sendData) => {
    const [data, setData] = useState(null);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        console.log(auth)
        const fetchData = async () => {
            if(sendData){
                if(auth === true){
                    console.log(auth)
                    try {
                        setIsLoading(true);
                        const response = await makeRequest({
                            method: method,
                            url: url,
                            data: body,
                            authToken: localStorage.getItem('authToken')
                        });
                        console.log(response.data);
                        setData(response.data);
                    } catch (err) {
                        console.error("Erreur lors de la requête:", err);
                        setError(err);
                    } finally {
                        setIsLoading(false);
                    }
                }
                else{      
                    try {
                        setIsLoading(true);
                        const response = await makeRequest({
                            method: method,
                            url: url,
                            data: body
                        });
                        console.log(response.data);
                        setData(response.data);
                    } catch (err) {
                        console.error("Erreur lors de la requête:", err);
                        setError(err);
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        };

        fetchData();
    }, [auth, sendData]);



    return { data, loading, error };
};

export default useFetch;