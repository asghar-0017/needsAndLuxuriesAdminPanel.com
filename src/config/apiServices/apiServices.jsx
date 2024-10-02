import axios from 'axios';
import API_CONFIG from '../API/api';
import { showErrorToast } from '../../components/toast/toast';

const { apiKey } = API_CONFIG;

export const postData = async (endpoint, data) => {
    console.log(`${apiKey}/${endpoint}`);
    try {
        const response = await axios.post(`${apiKey}/${endpoint}`, data);
        
        return response.data;
    } catch (error) {
        showErrorToast(error.message);
        throw new Error('Error posting data: ' + error.message);
    }
};