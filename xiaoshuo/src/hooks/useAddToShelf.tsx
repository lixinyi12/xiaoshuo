import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import { IS_LOGIN } from "../constants";
import { ROUTES } from "../constants/link";

export default function useAddToShelf() {
    const navigate = useNavigate();

    const handleAddToShelf = (novelId: any, callBack: any) => {
        const isLogin = sessionStorage.getItem(IS_LOGIN);

        if (!isLogin) {
            navigate(ROUTES.SIGNIN);
            return false;
        }

        userApi.addToShelf({ novelId }).then(res => {
            callBack();
        })
    };

    return handleAddToShelf;
}