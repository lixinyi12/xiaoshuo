import { authApi } from '../api'
import { login, logout } from '../reducers/auth'
import { IS_LOGIN } from '../constants';

// 登出方法
export function logOut() {
    return async (dispatch) => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('登出失败:', error);
        } finally {
            // 清空用户状态
            dispatch(logout());
        }
    };
}

// Redux异步处理
export function asyncSetUserObj(data) {
    return async dispatch => {
        return authApi.login(data).then((res) => {
            if (res.data.status === 200) {
                const { phone, email, nick, roles, permissions } = res.data.user;
                dispatch(login({
                    phone,
                    email,
                    nick,
                    roles,
                    permissions
                }))
                localStorage.setItem(IS_LOGIN, true)
                // 设置请求头
                // instance.defaults.headers.common['Authorization'] = `${res.data.token}`
            }
            return res
        }).catch(error => {
            console.error('登录失败:', error)
            throw error
        })
    }
}