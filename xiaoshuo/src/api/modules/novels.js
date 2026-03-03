import axios from '../../utils/request';
import baseUrl from '../config';

export default {
  // 获取小说详情
  getNovelDetail(params) {
    return axios.get(`${baseUrl}/getNovelDetail`, { params });
  },
  // 获取小说章节列表
  getChapterList(params) {
    return axios.get(`${baseUrl}/getChapterList`, { params });
  },
  // 获取章节内容
  getNovelContent(params) {
    return axios.get(`${baseUrl}/getNovelContent`, { params });
  },

  // 发布小说
  publishNovel(params) {
    return axios.post(`${baseUrl}/publishNovel`, params);
  },
  // 更新小说
  updateNovel(params) {
    return axios.patch(`${baseUrl}/updateNovel`, params); // 建议改为 PUT
  },
  // 删除小说
  deleteNovel(params) {
    return axios.post(`${baseUrl}/deleteNovel`, params); // 建议改为 DELETE
  },

  // 章节操作
  addChapter(params) {
    return axios.post(`${baseUrl}/addChapter`, params);
  },
  updateChapter(params) {
    return axios.post(`${baseUrl}/updateChapter`, params); // 建议改为 PUT
  },
  deleteChapter(params) {
    return axios.post(`${baseUrl}/deleteChapter`, params); // 建议改为 DELETE
  },

  // 其他小说相关
  incrementHot(params) {
    return axios.post(`${baseUrl}/incrementHot`, params);
  },
  updateWordCount(params) {
    return axios.post(`${baseUrl}/updateWordCount`, params);
  },

  // 封面上传/删除
  uploadCover(params) {
    return axios.post(`${baseUrl}/uploadCover`, params);
  },
  deleteCover(params) {
    return axios.post(`${baseUrl}/deleteCover`, params);
  },

  // 卡片数据
  card() {
    return axios.get(`${baseUrl}/card`);
  },
  // 搜索
  search(searchKey) {
    return axios.get(`${baseUrl}/search`, { params: { searchKey } });
  },
  // 所有标签
  tags() {
    return axios.get(`${baseUrl}/tags`);
  },

  // 评论
  addComment(params) {
    return axios.post(`${baseUrl}/addComment`, params);
  },
  childComments(params) {
    return axios.post(`${baseUrl}/childComments`, params);
  },
  novelComments(query) {
    return axios.get(`${baseUrl}/novelComments`, { params: query });
  },
};