import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IS_LOGIN } from '../constants';
interface Role {
    id: number,
    name: string,
    description: string
}
interface Permission {
    id: number,
    name: string,
    resource: string,
    action: string,
    description: string
}
interface UserInfo {
    nick: string,
    phone: string,
    email: string,
    roles: Role[],
    permissions: Permission[]
}

interface AuthState {
    isLogin: boolean;
    userInfo: UserInfo | null;
}

const storedIsLogin = sessionStorage.getItem(IS_LOGIN) === 'true';
const initialState: AuthState = {
    isLogin: storedIsLogin,
    userInfo: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserInfo>) => {
            state.isLogin = true;
            state.userInfo = action.payload;
            sessionStorage.setItem(IS_LOGIN, 'true');
        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
            sessionStorage.setItem(IS_LOGIN, 'false');
        },
    },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;