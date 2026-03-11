import axios from '../../utils/request';
import baseUrl from '../config';

export default {
    addApplication(params) {
        return axios.post(`${baseUrl}/addApplication`, params);
    },
    deleteApplication(params) {
        return axios.delete(`${baseUrl}/deleteApplication`, params);
    },
    setApplication(params) {
        return axios.patch(`${baseUrl}/setApplication`, params);
    },
    getApplicationsList(params) {
        return axios.get(`${baseUrl}/getApplicationsList`, params);
    }
};