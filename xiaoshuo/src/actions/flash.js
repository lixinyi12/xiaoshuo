export function addFlashMessage(message){
    return{
        type:'addFlash',
        message
    }
}
export function delFlashMessage(id){
    return{
        type:'delFlash',
        id
    }
}