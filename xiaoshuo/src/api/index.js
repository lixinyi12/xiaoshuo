import axios from '../utils/request'

// 网络请求访问路径
const base = {
    baseUrl: 'http://localhost:3300',
    register: '/api/register',
    repeatEmail: '/api/repeat/email',
    repeatPhone: '/api/repeat/phone',
    repeatPassword: '/api/repeat/password',
    repeatPassword2: '/api/repeat/password2',
    login: '/api/login',
    repeatUsername: '/api/repeat/username',
    list: '/api/list',
    card: '/api/card',
    search: '/api/search',
    hot: '/api/hot',
    latest: '/api/latest',
    tags: '/api/tags',
    collects: '/api/collects',
    score: '/api/score',
    finished: '/api/finished',
    user: '/api/user',
    follow: '/api/follow',
    like: '/api/like',
    commentsCount: '/api/commentsCount',
    comments: '/api/comments',
    childComments: '/api/childComments',
    collectCount: '/api/collectCount',
    collect: '/api/collect',
}

const api = {
    // 注册
    register(params) {
        return axios.post(base.baseUrl + base.register, params);
    },
    //邮箱是否可用
    repeatEmail(params) {
        return axios.get(base.baseUrl + base.repeatEmail, {
            params
        })
    },
    //手机号是否可用
    repeatPhone(params) {
        return axios.get(base.baseUrl + base.repeatPhone, {
            params
        })
    },
    //密码是否可用
    repeatPassword(params) {
        return axios.get(base.baseUrl + base.repeatPassword, {
            params
        })
    },
    //重复密码是否可用
    repeatPassword2(params) {
        return axios.get(base.baseUrl + base.repeatPassword2, {
            params
        })
    },
    //登录
    login(params) {
        return axios.post(base.baseUrl + base.login, params)
    },
    //用户名可用
    repeatUsername(params) {
        return axios.get(base.baseUrl + base.repeatUsername, {
            params
        })
    },
    //首页列表数据
    list() {
        return axios.get(base.baseUrl + base.list)
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
}

export default api