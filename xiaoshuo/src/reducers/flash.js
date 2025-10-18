

const flashState = [
]

export default (state = flashState,action)=>{
    switch (action.type) {
        case "addFlash":
            return[
                ...state,
                action.message
            ]
        case "delFlash":
            return state;
        default:
            return state;
    }
}