import { authApi } from '../api'
import instance from '../utils/request'
import { setUser, clearUser } from '../reducers/auth'
import { TOKEN } from '../constants'

// 登出方法
export function logOut(){
    return dispatch => {
        dispatch(clearUser())
        localStorage.removeItem(TOKEN)
        delete instance.defaults.headers.common['Authorization']
    }
}

// Redux异步处理
export function asyncSetUserObj(data){
    return async dispatch => {
        return authApi.login(data).then((res) => {
            if(res.data.status === 200){
                // token存入本地
                localStorage.setItem(TOKEN, res.data.token)
                // redux存用户信息
                dispatch(setUser({
                    token: res.data.token,
                    phone: res.data.user.phone,
                    email: res.data.user.email,
                    nick: res.data.user.nick
                }))
                // 设置请求头
                instance.defaults.headers.common['Authorization'] = `${res.data.token}`
            }
            return res
        }).catch(error => {
            console.error('登录失败:', error)
            throw error
        })
    }
}