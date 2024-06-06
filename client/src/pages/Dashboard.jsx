import React, { useEffect, useState } from "react";
import Tabs from "../components/DashboardComponents/Tabs/Tabs";
import ChatSection from "../components/DashboardComponents/ChatSection/ChatSection";
import FriendSection from "../components/DashboardComponents/FriendSection/FriendSection";
import ProfileSection from "../components/DashboardComponents/ProfileSection/ProfileSection";
import ActiveChat from "../components/DashboardComponents/ActiveChat/ActiveChat";
import ChangePassword from "../components/DashboardComponents/ChangePassword/ChangePassword";
import { userService } from "../api/user";
import Notifications from "../components/DashboardComponents/Notifications/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChatId, setChats } from "../store/chat/chatSlice";
import socket from "../socket/socket";

const Dashboard = () => {
    // Tab state
    const [tab, setTab] = useState("messages");

    // Notifications - Requests state
    const [notifications, setNotifications] = useState([]);

    // Friends
    const [friends, setFriends] = useState([]);

    // Messages state for active chat
    const [messages, setMessages] = useState([]);

    const dispatch = useDispatch();

    const { chats, activeChat, activeChatId } = useSelector((state) => state.chat);

    const getChats = async () => {
        const result = await userService.listChats();
        if (result) dispatch(setChats(result));
    };

    const getFriends = async () => {
        const result = await userService.listFriends();
        if (result) setFriends(result);
        else setFriends([]);
    };

    const getNotifications = async () => {
        const result = await userService.getNotifications();
        if (result) setNotifications(result);
        else setNotifications([]);
    };

    const acceptRequest = async (requestId) => {
        const result = await userService.acceptRequest(requestId);
        if (result) setNotifications((prev) => prev.filter((request) => request.requestId !== requestId));
    };

    const rejectRequest = async (requestId) => {
        const result = await userService.rejectRequest(requestId);
        if (result) setNotifications((prev) => prev.filter((request) => request.requestId !== requestId));
    };

    const manageActiveTab = () => {
        if (tab === "messages") return <ChatSection setTab={setTab} />;
        else if (tab === "friends") return <FriendSection friends={friends} acceptRequest={acceptRequest} rejectRequest={rejectRequest} getFriends={getFriends} setFriends={setFriends} />;
        else if (tab === "profile") return <ProfileSection setTab={setTab} />;
        else if (tab === "change-password") return <ChangePassword />;
        else if (tab === "notifications") return <Notifications notifications={notifications} acceptRequest={acceptRequest} rejectRequest={rejectRequest} />;
    };

    useEffect(() => {
        getChats();
        getNotifications();
        getFriends();
    }, []);

    useEffect(() => {
        if (activeChatId) dispatch(setActiveChatId(""));
    }, [tab]);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        socket.emit("init", user);
    }, []);

    useEffect(() => {
        socket.on("message-received", ({ message, chat }) => {
            if (message.chatId._id === activeChat._id) {
                setMessages([...messages, message]);
            }
            const updatedChats = [...chats];
            const index = updatedChats.findIndex((oldChat) => oldChat._id === chat._id);

            if (index !== -1) updatedChats.splice(index, 1);
            updatedChats.unshift(chat);
            dispatch(setChats(updatedChats));
        });

        socket.on("friend-request-received", (request) => {
            setNotifications([...notifications, request]);
        });
        socket.on("friend-request-removed-by-sender", (request) => {
            setNotifications(() => notifications.filter((notification) => notification.requestId !== request._id));
        });
        socket.on("friend-removed", (request) => {
            setFriends(() => friends.filter((oldFriend) => oldFriend.requestId !== request.requestId));
            const updatedChats = [...chats];
            const index = updatedChats.find((chat) => chat._id === request.chatId);

            if (index !== -1) updatedChats.splice(index, 1);
            if (activeChat._id === request.chatId) dispatch(setActiveChatId(""));
            dispatch(setChats(updatedChats));
        });
    });

    return (
        <div className="h-full flex flex-col-reverse sm:flex-row relative">
            <Tabs tab={tab} onTabClick={setTab} isChatOpen={activeChatId ? true : false} notificationCount={notifications.length} />
            <div className={`${!activeChatId ? "h-full overflow-auto" : ""}`}>
                <div
                    className={`duration-200 ease-in-out transition-all w-full h-full flex flex-col sm:border-r sm:min-w-60 md:min-w-80 sm:max-w-60 md:max-w-80 ${
                        activeChatId ? "max-sm:hidden" : ""
                    }`}>
                    {manageActiveTab()}
                </div>
            </div>
            <div className={`flex-1 flex flex-col h-full bg-gray-100 relative ${activeChatId ? "" : "max-sm:hidden"}`}>
                {activeChatId ? (
                    <ActiveChat messages={messages} setMessages={setMessages} />
                ) : (
                    <div className="py-3 flex flex-col items-center m-auto">
                        <span className="md:text-3xl text-2xl  app-title uppercase">Chat App By Rahul</span>
                        <span className="md:text-lg app-sub-title">A realtime chat application</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
