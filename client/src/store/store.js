import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth.js";
import chatSlice from "./chat/chatSlice.js";

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice,
    },
});

export default store;
