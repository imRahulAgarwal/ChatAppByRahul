import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    activeChat: {},
    activeChatId: "",
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload;
        },
    },
});

export const { setChats, setActiveChat, setActiveChatId } = chatSlice.actions;

export default chatSlice.reducer;
