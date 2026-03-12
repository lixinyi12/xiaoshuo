import { createSlice } from '@reduxjs/toolkit';
import { IS_LOGIN } from '../constants';

interface UserInfo {
    nick: string,
    phone: string,
    email: string,
    roles: string[],
    permissions: string[]
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
        login: (state, action) => {
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