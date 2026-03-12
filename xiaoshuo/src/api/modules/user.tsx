import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  // 个人信息
  user() {
    return axios.get(`${baseUrl}/user`);
  },
  changePersonalInfo(params: any) {
    return axios.patch(`${baseUrl}/changePersonalInfo`, params);
  },

  // 关注
  follow() {
    return axios.get(`${baseUrl}/follow`);
  },
  follows(params: any) {
    return axios.post(`${baseUrl}/follows`, params);
  },
  checkFollowStatus(query: any) {
    return axios.get(`${baseUrl}/checkFollowStatus`, { params: query });
  },

  // 点赞
  like() {
    return axios.get(`${baseUrl}/like`);
  },
  toggleLike(params: any) {
    return axios.put(`${baseUrl}/toggleLike`, params);
  },

  // 评论统计
  commentsCount() {
    return axios.get(`${baseUrl}/commentsCount`);
  },
  comments(query: any) {
    return axios.get(`${baseUrl}/comments`, { params: query });
  },
  childComments(query: any) {
    return axios.get(`${baseUrl}/childComments`, { params: query });
  },

  // 收藏
  collectCount() {
    return axios.get(`${baseUrl}/collectCount`);
  },
  collect(query: any) {
    return axios.get(`${baseUrl}/collect`, { params: query });
  },
  addToShelf(params: any) {
    return axios.post(`${baseUrl}/addToShelf`, params);
  },
  checkCollected(query: any) {
    return axios.get(`${baseUrl}/checkCollected`, { params: query });
  },

  // 作品
  worksCount() {
    return axios.get(`${baseUrl}/worksCount`);
  },
  works(query: any) {
    return axios.get(`${baseUrl}/works`, { params: query });
  },

  // 阅读历史
  history(query: any) {
    return axios.get(`${baseUrl}/history`, { params: query });
  },
  historyCount(query: any) {
    return axios.get(`${baseUrl}/historyCount`, { params: query });
  },

  // 评分
  addScore(params: any) {
    return axios.post(`${baseUrl}/addScore`, params);
  },
  getUserScore(query: any) {
    return axios.get(`${baseUrl}/getUserScore`, { params: query });
  },
  updateScore(params: any) {
    return axios.put(`${baseUrl}/updateScore`, params);
  }
};