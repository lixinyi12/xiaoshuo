import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  register(params) {
    return axios.post(`${baseUrl}/register`, params);
  },
  login(params) {
    return axios.post(`${baseUrl}/login`, params);
  },
  logout(params) {
    return axios.post(`${baseUrl}/logout`, params);
  },
  reset(params) {
    return axios.patch(`${baseUrl}/reset`, params);
  }
};