import findIndex from 'lodash/findIndex'

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
            let currentIndex = findIndex(state,(item)=>(item.id == action.id))
            return [
                ...state.slice(0,currentIndex),
                ...state.slice(currentIndex+1)
            ];
        default:
            return state;
    }
}