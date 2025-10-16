import axios from '../utils/request'

// 网络请求访问路径
const base = {
    baseUrl:'http://localhost:3300',
    register:'/api/register'
}

const api = {
    // 注册
    register(params){
        return axios.post(base.baseUrl + base.register,params);
    }
}

export default api