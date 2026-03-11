import { authApi, userApi } from '../api'
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
            console.log(res.data)
            if (res.data.status === 200) {
                const { phone, email, nick, roles, permissions } = res.data.user;
                dispatch(login({
                    phone,
                    email,
                    nick,
                    roles,
                    permissions
                }))
                sessionStorage.setItem(IS_LOGIN, true)
            }
            return res
        }).catch(error => {
            console.error('登录失败:', error)
            throw error
        })
    }
}

export function fetchCurrentUser() {
    return async dispatch => {
        try {
            const res = await userApi.user();
            if (res.data.status === 200) {
                const { phone, email, nick, roles, permissions } = res.data.result;
                dispatch(login({ phone, email, nick, roles, permissions }));
            } else {
                // 未登录或 token 无效，清除 Redux 中的用户状态
                dispatch(logout());
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            dispatch(logout());
        }
    };
}