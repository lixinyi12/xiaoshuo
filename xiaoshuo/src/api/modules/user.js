import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  // 个人信息
  user(query) {
    return axios.get(`${baseUrl}/user`, { params: query });
  },
  changePersonalInfo(params) {
    return axios.patch(`${baseUrl}/changePersonalInfo`, params);
  },

  // 关注
  follow(query) {
    return axios.get(`${baseUrl}/follow`, { params: query });
  },
  follows(params) {
    return axios.post(`${baseUrl}/follows`, params);
  },
  checkFollowStatus(query) {
    return axios.get(`${baseUrl}/checkFollowStatus`, { params: query });
  },

  // 点赞
  like(query) {
    return axios.get(`${baseUrl}/like`, { params: query });
  },
  toggleLike(params) {
    return axios.put(`${baseUrl}/toggleLike`, params);
  },

  // 评论统计
  commentsCount(query) {
    return axios.get(`${baseUrl}/commentsCount`, { params: query });
  },
  comments(query) {
    return axios.get(`${baseUrl}/comments`, { params: query });
  },
  childComments(query) {
    return axios.get(`${baseUrl}/childComments`, { params: query });
  },

  // 收藏
  collectCount(query) {
    return axios.get(`${baseUrl}/collectCount`, { params: query });
  },
  collect(query) {
    return axios.get(`${baseUrl}/collect`, { params: query });
  },
  addToShelf(params) {
    return axios.post(`${baseUrl}/addToShelf`, params);
  },
  checkCollected(query) {
    return axios.get(`${baseUrl}/checkCollected`, { params: query });
  },

  // 作品
  worksCount(query) {
    return axios.get(`${baseUrl}/worksCount`, { params: query });
  },
  works(query) {
    return axios.get(`${baseUrl}/works`, { params: query });
  },

  // 阅读历史
  history(query) {
    return axios.get(`${baseUrl}/history`, { params: query });
  },
  historyCount(query) {
    return axios.get(`${baseUrl}/historyCount`, { params: query });
  },

  // 评分
  addScore(params) {
    return axios.post(`${baseUrl}/addScore`, params);
  },
  getUserScore(query) {
    return axios.get(`${baseUrl}/getUserScore`, { params: query });
  },
  updateScore(params) {
    return axios.put(`${baseUrl}/updateScore`, params);
  }
};