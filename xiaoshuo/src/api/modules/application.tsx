import axios from '../../utils/request';
import baseUrl from '../config';

export default {
    addApplication(params: any) {
        return axios.post(`${baseUrl}/addApplication`, params);
    },
    deleteApplication(params: any) {
        return axios.delete(`${baseUrl}/deleteApplication`, params);
    },
    setApplication(params: any) {
        return axios.patch(`${baseUrl}/setApplication`, params);
    },
    getApplicationsList(params: any) {
        return axios.get(`${baseUrl}/getApplicationsList`, { params });
    }
};