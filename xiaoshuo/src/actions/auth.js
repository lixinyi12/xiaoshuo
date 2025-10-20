import api from '../api'
import instance from '../utils/request'
import { SET_USER, TOKEN } from '../constants'

function setUserObj(token){
    return{
        type:SET_USER,
        token
    }
}

//登出方法（清空redux）
export function logOut(){
    return dispatch=>{
        dispatch(setUserObj(null))
    }
}

// Redux异步处理
export function asyncSetUserObj(data){
    return async dispatch =>{
        return api.login(data).then((res)=>{
            if(res.data.status === 200){
                //token存入本地
                localStorage.setItem(TOKEN,res.data.token)
                //redux存token
                dispatch(setUserObj(res.data.token))
                //设置请求头
                instance.defaults.headers.common['Authorization'] = `${res.data.token}`;
            }
            return res
        })
    }
}