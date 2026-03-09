import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import { IS_LOGIN } from "../constants";
import { ROUTES } from "../constants/link";

export default function useAddToShelf() {
    const navigate = useNavigate();

    const handleAddToShelf = (novelId, callBack) => {
        const isLogin = localStorage.getItem(IS_LOGIN);

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