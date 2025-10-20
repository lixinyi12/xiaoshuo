import axios from 'axios'
import qs from 'querystring'
import store from '../store'
import { TOKEN } from '../constants'

/**
 * 连接后台与服务器
 */

// 错误信息返回
const errorHandle = (status,info) =>{
    switch (status) {
        case 400:
            console.log('语义有误，当前请求无法被服务器理解')
            break;
        case 401:
            console.log('服务器认证失败')
            break;
        case 403:
            console.log('服务器理解请求，但拒绝执行它')
            break;
        case 404:
            console.log('请检查网络请求地址')
            break;
        case 500:
            console.log('服务器遇到未曾预料的状况，导致无法完成对请求的处理')
            break;
        case 502:
            console.log('作为网关或代理工作的服务器尝试执行结束时，从上游服务器接收到无效请求')
            break;
        default:
            break;
    }
}

const instance = axios.create({
    timeout:5000
})

//请求拦截
instance.interceptors.request.use(
    config => {
        if(config.method === 'post'){
            config.data = qs.stringify(config.data)
        }

        const token = store.getState().auth.token || localStorage.getItem(TOKEN);
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }

        return config
    },
    error => Promise.reject(error)
)

//响应拦截
instance.interceptors.response.use(
    response => response.status === 200 ? Promise.resolve(response) : Promise.reject,
    error => {
        const {response} = error
        errorHandle(response.status,response.info)
    }
)

export default instance