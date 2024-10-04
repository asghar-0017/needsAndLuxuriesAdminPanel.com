import axios from 'axios';
import API_CONFIG from '../api/api';
import { showErrorToast } from '../../components/toast/toast';

const { apiKey } = API_CONFIG;

export const postData = async (endpoint, data) => {
    try {
        const response = await axios.post(`${apiKey}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        showErrorToast(error.message);
        throw new Error('Error posting data: ' + error.message);
    }
};

export const updateData = async (endpoint, data) => {
    try {
        const response = await axios.put(`${apiKey}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        showErrorToast(error.message);
        throw new Error('Error updating data: ' + error.message);
    }
};

export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${apiKey}/${endpoint}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
};

export const deleteDataById = async (endpoint, id) => {
    try {
        const response = await axios.delete(`${apiKey}/${endpoint}/${id}`);
        return response.data.data;
    } catch (error) {
        showErrorToast(error.message);
        throw new Error('Error deleting data: ' + error.message);
    }
};