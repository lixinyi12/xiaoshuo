import { ADD_FLASH,DEL_FLASH } from "../constants"

export function addFlashMessage(message: any){
    return{
        type:ADD_FLASH,
        message
    }
}
export function delFlashMessage(id: any){
    return{
        type:DEL_FLASH,
        id
    }
}