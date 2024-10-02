import axios from 'axios';
import API_CONFIG from '../API/api';
import { showErrorToast } from '../../components/toast/toast';

const { apiKey } = API_CONFIG;

export const postData = async (endpoint, data) => {
    try {
        const response = await axios.post(`${apiKey}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        showErrorToast(error.message);
        console.log(error);
        
        throw new Error('Error posting data: ' + error.message);
    }
};

export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${apiKey}/${endpoint}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
};