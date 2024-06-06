import moment from "moment-timezone";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChatId } from "../../store/chat/chatSlice";

const Chat = ({ chat }) => {
    const { user } = useSelector((state) => state.auth);
    const { activeChatId } = useSelector((state) => state.chat);

    const dispatch = useDispatch();

    const friend = chat.users.filter((u) => u._id !== user._id)[0];
    let latestMessage = "";
    let latestMessageTime = "";

    if (chat.latestMessage) {
        if (chat.latestMessage.content.length <= 15) {
            latestMessage = chat.latestMessage.content;
        } else {
            latestMessage = chat.latestMessage.content.substring(0, 15) + "...";
        }
        latestMessageTime = moment(chat.latestMessage.createdAt).tz("Asia/Kolkata").format("HH:mm");
    }

    return (
        <div className={`p-2 rounded flex items-center cursor-pointer ${activeChatId === friend._id ? "bg-gray-300" : "hover:bg-gray-200"}`} onClick={() => dispatch(setActiveChatId(friend._id))}>
            <div className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mr-3">
                <img src={friend.image} className="rounded-full h-full w-full" />
            </div>
            <div className="flex-1">
                <p>{friend.name}</p>
                <p className="flex justify-between">
                    <span className="text-sm">{latestMessage}</span>
                    <span className="text-xs">{latestMessageTime}</span>
                </p>
            </div>
        </div>
    );
};

export default Chat;
