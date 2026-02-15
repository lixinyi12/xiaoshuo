import { useNavigate } from "react-router-dom";
import api from "../api";
import { TOKEN } from "../constants";
import { ROUTES } from "../constants/link";
import { decodeToken } from "../utils/token";

export default function useAddToShelf() {
    const navigate = useNavigate();

    const handleAddToShelf = (novelId,callBack) => {
        const token = localStorage.getItem(TOKEN);

        if (!token) {
            navigate(ROUTES.SIGNIN);
            return false;
        }

        const { uid: userId } = decodeToken(token)
        api.addToShelf({userId, novelId}).then(res => {
            callBack();
        })
    };

    return handleAddToShelf;
}