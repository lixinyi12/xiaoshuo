import { createSlice } from '@reduxjs/toolkit';
import { IS_LOGIN } from '../constants';

const storedIsLogin = localStorage.getItem(IS_LOGIN) === 'true';
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
            localStorage.setItem(IS_LOGIN, true);
        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
            localStorage.setItem(IS_LOGIN, false);
        },
    },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;