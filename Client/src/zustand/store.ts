import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./profileSlice";

// Redux Persist 설정
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // ✅ 'auth' 상태 유지
};

// 여러 리듀서를 합치기
const rootReducer = combineReducers({
    auth: authReducer, // ✅ auth 리듀서 등록
});

// Persist 적용
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store 생성
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Redux Persist 관련 오류 방지
        }),
});

// Persistor 생성
const persistor = persistStore(store);

// RootState 타입 설정
export type RootState = ReturnType<typeof store.getState>;

// ✅ store와 persistor export
export { store, persistor };
