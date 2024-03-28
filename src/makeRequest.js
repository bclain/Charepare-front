import axios from "axios";

export const makeRequest = ({ url, method, data, authToken }) => {
    // Utiliser le token d'utilisateur si disponible, sinon utiliser le token par défaut
    const token = authToken || process.env.REACT_APP_API_TOKEN;
   

    if (data && data.data){            
        
    console.log(data);
    }

    const headers = {
        Authorization: `Bearer ${token}`, // Utilisez le token ici
    };

    // Vérifiez si les données sont de type FormData et ajustez les en-têtes en conséquence
    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: headers,
    });

    return axiosInstance({
        method: method,
        url: url,
        data: data,
    });
};