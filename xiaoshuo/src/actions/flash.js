export function addFlashMessage(message){
    return{
        type:'addFlash',
        message
    }
}
export function delFlashMessage(){
    return{
        type:'delFlash'
    }
}