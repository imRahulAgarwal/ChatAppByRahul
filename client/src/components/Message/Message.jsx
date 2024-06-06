import React from "react";
import moment from "moment-timezone";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div
            className={`flex relative justify-between mx-2 my-1 min-w-10 sm:max-w-80 max-w-64 w-fit break-words p-1 rounded-sm ${
                message.senderId._id === user._id ? "bg-blue-300 ml-auto" : "bg-gray-300 mr-auto"
            }`}>
            <div className="overflow-hidden">
                <span className="pr-10 text-base break-words">{message.content}</span>
                <span className="text-xs absolute bottom-0.5 right-1">{moment(message.createdAt).tz("Asia/Kolkata").format("HH:mm")}</span>
            </div>
        </div>
    );
};

export default React.memo(Message);
