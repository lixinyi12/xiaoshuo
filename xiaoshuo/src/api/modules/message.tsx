import axios from '../../utils/request';
import baseUrl from '../config';

const message = {
    sendMessage(params: any) {
        return axios.post(`${baseUrl}/sendMessage`, params);
    },
    messagesList(params: any) {
        return axios.get(`${baseUrl}/messagesList`, params);
    },
    messagesUnreadCount(params: any) {
        return axios.get(`${baseUrl}/messagesUnreadCount`, params);
    },
    messagesRead(params: any) {
        return axios.patch(`${baseUrl}/messagesRead`, { params });
    },
    getMessageById(params: any) {
        return axios.get(`${baseUrl}/getMessageById`, params);
    },
    deleteMessages(params: any) {
        return axios.delete(`${baseUrl}/deleteMessages`, { params });
    }
};
export default message;