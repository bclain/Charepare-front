import axios from "axios";

export const makeRequest = ({ url, method, data, authToken }) => {
    // Utiliser le token d'utilisateur si disponible, sinon utiliser le token par défaut
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTcyLjE2Ljg3LjEwMTo4MDAzL2FwaS9sb2dpbnVzZXIiLCJpYXQiOjE3MTA3OTEwMjQsImV4cCI6MTcxMDc5NDYyNCwibmJmIjoxNzEwNzkxMDI0LCJqdGkiOiI4eFhVdE5YTzZlc1dweW1MIiwic3ViIjoiMSIsInBydiI6IjQxZWZiN2JhZDdmNmY2MzJlMjQwNWJkM2E3OTNiOGE2YmRlYzY3NzciLCJyb2xlIjoiY2xpZW50In0.CRd2Pp47s5c09UNX0nJAKiqSDOF2P9m5J8POd2_HYGE";
   

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
        baseURL: process.env.REACT_APP_API_URL
    });

    return axiosInstance({
        method: method,
        url: url,
        data: data,
    });
};