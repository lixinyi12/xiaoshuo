import axios from '../utils/request'

// 网络请求访问路径
const base = {
    baseUrl: 'http://localhost:3300/api',
    register: '/register',
    login: '/login',
    reset: '/reset',
    card: '/card',
    search: '/search',
    hot: '/hot',
    latest: '/latest',
    tags: '/tags',
    collects: '/collects',
    score: '/score',
    finished: '/finished',
    user: '/user',
    follow: '/follow',
    like: '/like',
    commentsCount: '/commentsCount',
    comments: '/comments',
    childComments: '/childComments',
    collectCount: '/collectCount',
    collect: '/collect',
    history: '/history',
    worksCount: '/worksCount',
    historyCount: '/historyCount',
    followFan: '/followFan',
    follows: '/follows',
    works: '/works',
    getNovelContent: '/getNovelContent',
    changePersonalInfo: '/changePersonalInfo',
    getNovelDetail: '/getNovelDetail',
    getChapterList: '/getChapterList',
    addToShelf: '/addToShelf',
    publishNovel: '/publishNovel'
}

const api = {
    getNovelContent(params) {
        return axios.get(base.baseUrl + base.getNovelContent, { params });
    },
    getNovelDetail(params) {
        return axios.get(base.baseUrl + base.getNovelDetail, { params });
    },
    getChapterList(params) {
        return axios.get(base.baseUrl + base.getChapterList, { params });
    },
    // 注册
    register(params) {
        return axios.post(base.baseUrl + base.register, params);
    },
    // 登录
    login(params) {
        return axios.post(base.baseUrl + base.login, params)
    },
    // 忘记密码
    reset(params) {
        return axios.post(base.baseUrl + base.reset, params)
    },
    card() {
        return axios.get(base.baseUrl + base.card)
    },
    search(searchKey) {
        return axios.get(base.baseUrl + base.search, {
            params: { searchKey }
        });
    },
    hot() {
        return axios.get(base.baseUrl + base.hot)
    },
    latest() {
        return axios.get(base.baseUrl + base.latest)
    },
    tags() {
        return axios.get(base.baseUrl + base.tags)
    },
    collects() {
        return axios.get(base.baseUrl + base.collects)
    },
    score() {
        return axios.get(base.baseUrl + base.score)
    },
    finished() {
        return axios.get(base.baseUrl + base.finished)
    },
    user(query) {
        return axios.get(base.baseUrl + base.user, { params: query });
    },
    follow(query) {
        return axios.get(base.baseUrl + base.follow, { params: query });
    },
    like(query) {
        return axios.get(base.baseUrl + base.like, { params: query });
    },
    commentsCount(query) {
        return axios.get(base.baseUrl + base.commentsCount, { params: query });
    },
    comments(query) {
        return axios.get(base.baseUrl + base.comments, { params: query });
    },
    childComments(query) {
        return axios.get(base.baseUrl + base.childComments, { params: query });
    },
    collectCount(query) {
        return axios.get(base.baseUrl + base.collectCount, { params: query });
    },
    collect(query) {
        return axios.get(base.baseUrl + base.collect, { params: query });
    },
    history(query) {
        return axios.get(base.baseUrl + base.history, { params: query });
    },
    worksCount(query) {
        return axios.get(base.baseUrl + base.worksCount, { params: query });
    },
    historyCount(query) {
        return axios.get(base.baseUrl + base.historyCount, { params: query });
    },
    followFan(query) {
        return axios.get(base.baseUrl + base.followFan, { params: query });
    },
    follows(params) {
        return axios.post(base.baseUrl + base.follows, params);
    },
    works(query) {
        return axios.get(base.baseUrl + base.works, { params: query });
    },
    changePersonalInfo(params) {
        return axios.post(base.baseUrl + base.changePersonalInfo, params);
    },
    addToShelf(params) {
        return axios.post(base.baseUrl + base.addToShelf, params);
    },
    publishNovel(params) {
        return axios.post(base.baseUrl + base.publishNovel, params);
    },
}

export default api