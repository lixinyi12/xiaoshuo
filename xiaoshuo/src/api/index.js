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
    follows: '/follows',
    works: '/works',
    getNovelContent: '/getNovelContent',
    changePersonalInfo: '/changePersonalInfo',
    getNovelDetail: '/getNovelDetail',
    getChapterList: '/getChapterList',
    addToShelf: '/addToShelf',
    publishNovel: '/publishNovel',
    checkCollected: '/checkCollected',
    updateNovel: '/updateNovel',
    deleteChapter: '/deleteChapter',
    addChapter: '/addChapter',
    updateChapter: '/updateChapter',
    deleteNovel: '/deleteNovel',
    novelComments: '/novelComments',
    addComment: '/addComment',
    addScore: '/addScore',
    getUserScore: '/getUserScore',
    updateScore: '/updateScore',
    incrementHot: '/incrementHot',
    updateWordCount: '/updateWordCount',
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
    checkCollected(query) {
        return axios.get(base.baseUrl + base.checkCollected, { params: query });
    },
    updateNovel(params) {
        return axios.post(base.baseUrl + base.updateNovel, params);
    },
    deleteChapter(params) {
        return axios.post(base.baseUrl + base.deleteChapter, params);
    },
    addChapter(params) {
        return axios.post(base.baseUrl + base.addChapter, params);
    },
    updateChapter(params) {
        return axios.post(base.baseUrl + base.updateChapter, params);
    },
    deleteNovel(params) {
        return axios.post(base.baseUrl + base.deleteNovel, params);
    },
    novelComments(query) {
        return axios.get(base.baseUrl + base.novelComments, { params: query });
    },
    addComment(params) {
        return axios.post(base.baseUrl + base.addComment, params);
    },
    addScore(params) {
        return axios.post(base.baseUrl + base.addScore, params);
    },
    getUserScore(query) {
        return axios.get(base.baseUrl + base.getUserScore, { params: query });
    },
    updateScore(params) {
        return axios.put(base.baseUrl + base.updateScore, params);
    },
    incrementHot(params) {
        return axios.post(base.baseUrl + base.incrementHot, params);
    },
    updateWordCount(params) {
        return axios.post(base.baseUrl + base.updateWordCount, params);
    },
}

export default api