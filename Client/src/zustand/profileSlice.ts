// authSlice.ts (파일명도 authSlice.ts로 변경)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null; // token의 초기값을 null로 설정
}

const initialState: AuthState = {
    token: null, // 초기값을 null로 설정
};

const authSlice = createSlice({
    name: 'auth',  // 'profile'에서 'auth'로 변경
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;  // auth 리듀서를 export
