import { createSlice } from '@reduxjs/toolkit';

const userState = {
    token: null,
    phone: null,
    email: null,
    nick: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState: userState,
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            state.phone = action.payload.phone;
            state.email = action.payload.email;
            state.nick = action.payload.nick;
        },
        clearUser: (state) => {
            state.token = null;
            state.phone = null;
            state.email = null;
            state.nick = null;
        }
    }
});
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;