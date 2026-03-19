import axios from '../../utils/request';
import baseUrl from '../config';

const auth = {
  register(params: any) {
    return axios.post(`${baseUrl}/register`, params);
  },
  login(params: any) {
    return axios.post(`${baseUrl}/login`, params);
  },
  logout() {
    return axios.post(`${baseUrl}/logout`);
  },
  reset(params: any) {
    return axios.patch(`${baseUrl}/reset`, params);
  }
};
export default auth;