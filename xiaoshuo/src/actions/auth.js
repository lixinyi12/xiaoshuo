import api from '../api'

function setUserObj(user){
    return{
        type:'setUser',
        user
    }
}

//登出方法（清空redux）
export function logOut(){
    return dispatch=>{
        dispatch(setUserObj({}))
    }
}

// Redux异步处理
export function asyncSetUserObj(data){
    return async dispatch =>{
        return api.login(data).then((res)=>{
            if(res.data.status === 200){
                //redux存token
                dispatch(setUserObj(res.data.token))
                //token存入本地
                //LocalStorage
                localStorage.setItem('xiaoshuo',res.data.token)
            }
            return res
        })
    }
}