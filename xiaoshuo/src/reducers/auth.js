import { createSlice } from '@reduxjs/toolkit';
import { IS_LOGIN } from '../constants';

const storedIsLogin = sessionStorage.getItem(IS_LOGIN) === 'true';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogin: storedIsLogin,
        userInfo: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLogin = true;
            state.userInfo = action.payload;
            sessionStorage.setItem(IS_LOGIN, true);
        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
            sessionStorage.setItem(IS_LOGIN, false);
        },
    },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;