import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  register(params) {
    return axios.post(`${baseUrl}/register`, params);
  },
  login(params) {
    return axios.post(`${baseUrl}/login`, params);
  },
  reset(params) {
    return axios.patch(`${baseUrl}/reset`, params);
  }
};