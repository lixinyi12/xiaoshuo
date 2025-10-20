import { SET_USER } from "../constants";

const userState = {
    token:null
}
const auth = (state = userState,action)=>{
    switch (action.type) {
        case SET_USER:
            return {
                token:action.token
            };
        default:
            return state;
    }
}

export default auth