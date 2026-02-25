import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  // 热度榜
  hot() {
    return axios.get(`${baseUrl}/hot`);
  },
  // 最新更新
  latest() {
    return axios.get(`${baseUrl}/latest`);
  },
  // 收藏榜
  collects() {
    return axios.get(`${baseUrl}/collects`);
  },
  // 评分榜
  score() {
    return axios.get(`${baseUrl}/score`);
  },
  // 完结榜
  finished() {
    return axios.get(`${baseUrl}/finished`);
  }
};