import React, { useState } from "react";
import Friend from "../../Friend/Friend";
import Input from "../../Input/Input";
import { userService } from "../../../api/user";
import socket from "../../../socket/socket";
import { toast } from "react-toastify";
import { toastOptions } from "../../../conf/conf";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../../store/chat/chatSlice";

const FriendSection = ({ friends, acceptRequest, rejectRequest, getFriends, setFriends }) => {
    // State to add new friend
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [users, setUsers] = useState([]);

    const { chats } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const handleSearchFriend = async (e) => {
        const value = e.target.value;
        setSearchUser(value);

        if (value) {
            const result = await userService.searchFriends(value);
            if (result) return setUsers(result);
        }

        if (!value) return setUsers([]);
        setUsers([]);
    };

    const handleClick = async (user) => {
        let result = null;
        switch (user.isFriend) {
            case "Follow":
                result = await userService.sendRequest(user.user._id);
                if (result) {
                    emptyState();
                    socket.emit("friend-request-send", result);
                }
                break;
            case "Pending":
                result = await userService.removeRequest(user.requestId);
                if (result) {
                    emptyState();
                    socket.emit("friend-request-removed", result);
                }
                break;
            case "Unfollow":
                result = await userService.removeFriend(user.requestId);
                if (result) {
                    emptyState();
                    socket.emit("friend-removed", result);
                    setFriends((prev) => prev.filter((friend) => friend.requestId !== result.requestId));

                    const updatedChats = [...chats];
                    const index = updatedChats.findIndex((chat) => chat._id === result.chatId);

                    if (index !== -1) updatedChats.splice(index, 1);
                    dispatch(setChats(updatedChats));
                }
                break;
        }
    };

    const handleRefresh = () => {
        getFriends();
        toast.info("Friend list refreshed", toastOptions);
    };

    const emptyState = () => {
        setUsers([]);
        setSearchUser("");
        setShowAddFriendModal(false);
    };

    return (
        <>
            <div className="flex border-b justify-between px-2 py-4">
                <h1>Friends</h1>

                <div className="flex gap-x-2">
                    <button onClick={() => setShowAddFriendModal(true)} title="Add a new friend">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                        </svg>
                    </button>
                    <button onClick={handleRefresh} title="Refresh">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 512 512">
                            <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`h-full overflow-y-auto ${friends.length ? "" : "flex"}`}>
                <div className="p-2 flex flex-col gap-y-2 m-auto w-full">
                    {friends.length ? (
                        friends.map((friend) => <Friend friend={friend} key={friend.requestId} handleClick={() => handleClick(friend)} />)
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-y-2 text-lg rounded border bg-gray-200 w-full p-2">
                            <p className="">Add a new friend</p>
                            <button onClick={() => setShowAddFriendModal(true)} className="rounded-full bg-white p-2" title="Start a new chat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showAddFriendModal && (
                <div className="z-50 w-full h-full flex left-0 top-0 bottom-0 right-0 absolute">
                    <div className="z-50 md:w-1/2 sm:w-3/4 w-11/12 m-auto relative">
                        <div className="bg-white rounded shadow-lg">
                            <div className="flex flex-wrap flex-col">
                                <button className="ml-auto flex justify-center items-center right-0 top-0 m-2 text-xl font-bold" onClick={emptyState}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 384 512">
                                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                    </svg>
                                </button>
                                <Input
                                    value={searchUser}
                                    setChange={handleSearchFriend}
                                    divClass="mx-2 mt-2"
                                    inputClass="border border-b-0 rounded-t px-4 py-2"
                                    id="searchUser"
                                    label="Add a friend"
                                    title="Add a friend"
                                    autocomplete="on"
                                    labelClass="hidden"
                                />
                                <ul className="mx-2 border overflow-y-auto min-h-32 flex flex-col gap-y-2">
                                    {users.length
                                        ? users.map((user) => (
                                              <li className="p-2 bg-gray-100" key={user.user._id}>
                                                  <div className="flex justify-between sm:px-2">
                                                      <div className="flex items-center">
                                                          <img src={user.user.image} className="border border-[#00000035] w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mr-3" />
                                                          <div className="flex flex-col">
                                                              <span>{user.user.name}</span>
                                                              <span className="text-xs">{user.user.bio}</span>
                                                          </div>
                                                      </div>
                                                      <div className="flex items-center">
                                                          {user.isSender || user.isFriend !== "Pending" ? (
                                                              <button
                                                                  className="px-4 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white duration-200 ease-in-out transition-colors"
                                                                  onClick={() => handleClick(user)}>
                                                                  {user.isFriend}
                                                              </button>
                                                          ) : (
                                                              <div className="flex md:flex-row flex-col gap-2">
                                                                  <button
                                                                      className="px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-white duration-200 ease-in-out transition-colors"
                                                                      onClick={() => {
                                                                          acceptRequest(user.requestId);
                                                                          emptyState();
                                                                      }}>
                                                                      Accept
                                                                  </button>
                                                                  <button
                                                                      className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white duration-200 ease-in-out transition-colors"
                                                                      onClick={() => {
                                                                          rejectRequest(user.requestId);
                                                                          emptyState();
                                                                      }}>
                                                                      Reject
                                                                  </button>
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                              </li>
                                          ))
                                        : ""}
                                </ul>
                                <div className="p-4 border-t flex justify-center mt-4">
                                    <button
                                        type="button"
                                        onClick={emptyState}
                                        className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:ring-0 hover:border-gray-300 mr-2">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
                </div>
            )}
        </>
    );
};

export default FriendSection;
