import api from '../api'

function setUserObj(user){
    return{
        type:'setUser',
        user
    }
}

// Redux异步处理
export function asyncSetUserObj(data){
    return async dispatch =>{
        return api.login(data).then((res)=>{
            if(res.data.status === 200){
                //redux存token
                dispatch(setUserObj(res.data.token))
            }
            return res
        })
    }
}