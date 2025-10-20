const userState = {
    token:null
}
const auth = (state = userState,action)=>{
    switch (action.type) {
        case 'setUser':
            return {
                token:action.token
            };
        default:
            return state;
    }
}

export default auth