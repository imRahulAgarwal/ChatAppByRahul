import React, { useEffect, useState } from "react";
import Message from "../../Message/Message";
import ScrollToBottom from "../../../hooks/ScrollToBottom";
import { userService } from "../../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setActiveChat, setActiveChatId } from "../../../store/chat/chatSlice";
import socket from "../../../socket/socket";
import Loader from "../../Loader/Loader";

const ActiveChat = ({ messages, setMessages }) => {
    const { user } = useSelector((state) => state.auth);
    const { chats, activeChat, activeChatId } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    // Message to send, input
    const [message, setMessage] = useState("");

    // State to manage typing event
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleCloseButton = () => dispatch(setActiveChatId(""));

    const getChat = async () => {
        const result = await userService.accessChat(activeChatId);
        if (result) {
            const messages = await userService.listMessages(result._id);
            if (messages) {
                setMessages(messages);
                dispatch(setActiveChat(result));
                socket.emit("active-chat", result._id);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        socket.emit("stop-typing", activeChat._id);
        const result = await userService.addMessage(activeChat._id, message);
        if (result.message) {
            // This emit function will handle the message on other user side.
            socket.emit("new-message", result);

            // The setMessages function adds the message to the array
            setMessages((prev) => [...prev, result.message]);

            // this is to update my lists of chat
            const updatedChats = [...chats];
            const index = updatedChats.findIndex((oldChat) => oldChat._id === result.chat._id);

            if (index !== -1) {
                updatedChats.splice(index, 1);
                updatedChats.unshift(result.chat);
                dispatch(setChats(updatedChats));
            }
        }
        setMessage("");
    };

    useEffect(() => {
        getChat();
    }, [activeChatId]);

    useEffect(() => {
        socket.on("start-typing", () => setIsTyping(true));
        socket.on("stop-typing", () => setIsTyping(false));
    }, []);

    const typingHandler = (e) => {
        setMessage(e.target.value);

        if (!typing) {
            setTyping(true);
            socket.emit("start-typing", activeChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop-typing", activeChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    if (!activeChat.users) return <Loader />;

    const friend = activeChat.users.filter((u) => u._id !== user._id)[0];

    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b justify-between px-4 py-2">
                <div className="flex items-center w-full">
                    <button className="text-black mr-4 sm:hidden" onClick={handleCloseButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                        </svg>
                    </button>
                    <div className="h-10 w-10 rounded-full">
                        <img src={friend && friend.image} className="rounded-full h-10 w-10" />
                    </div>
                    <div className="flex flex-col ml-2 justify-center">
                        <span className="">{friend && friend.name}</span>
                        {isTyping && <span className="text-xs">Typing...</span>}
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
                {messages.map((message, index) => (
                    <Message message={message} key={message._id} />
                ))}
                <ScrollToBottom />
            </div>
            <form className="flex" onSubmit={handleSubmit}>
                <input type="text" className="px-4 py-3 w-full border-t outline-none" placeholder="Message to send" value={message} onChange={typingHandler} />
                {message && (
                    <button type="submit" className="text-black px-6 bg-blue-400 hover:bg-blue-600 hover:text-white duration-200 ease-in-out transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
};

export default ActiveChat;
