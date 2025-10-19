import axios from '../utils/request'

// 网络请求访问路径
const base = {
    baseUrl:'http://localhost:3300',
    register:'/api/register',
    repeatEmail:'/api/repeat/email',
    repeatPhone:'/api/repeat/phone',
    repeatPassword:'/api/repeat/password',
    repeatPassword2:'/api/repeat/password2',
    login:'/api/login',
    repeatUsername:'/api/repeat/username'
}

const api = {
    // 注册
    register(params){
        return axios.post(base.baseUrl + base.register,params);
    },
    //邮箱是否可用
    repeatEmail(params){
        return axios.get(base.baseUrl+base.repeatEmail,{
            params
        })
    },
    //手机号是否可用
    repeatPhone(params){
        return axios.get(base.baseUrl+base.repeatPhone,{
            params
        })
    },
    //密码是否可用
    repeatPassword(params){
        return axios.get(base.baseUrl+base.repeatPassword,{
            params
        })
    },
    //重复密码是否可用
    repeatPassword2(params){
        return axios.get(base.baseUrl+base.repeatPassword2,{
            params
        })
    },
    //登录
    login(params){
        return axios.post(base.baseUrl+base.login,params)
    },
    repeatUsername(params){
        return axios.get(base.baseUrl+base.repeatUsername,{
            params
        })
    },
}

export default api