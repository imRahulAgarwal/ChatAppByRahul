import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveChatId } from "../../store/chat/chatSlice";

const Friend = ({ friend, handleClick }) => {
    const [showMenuModal, setShowMenuModal] = useState(false);
    const menuModal = useRef(null);

    const dispatch = useDispatch();

    const closeMenu = (e) => {
        if (showMenuModal && !menuModal.current?.contains(e.target)) {
            setShowMenuModal(false);
        }
    };

    document.addEventListener("mousedown", closeMenu);

    return (
        <div className={`p-2 flex justify-between border-b`}>
            <div className="flex items-center cursor-pointer flex-1" onClick={() => dispatch(setActiveChatId(friend.friend._id))}>
                <div className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mr-3">
                    <img src={friend.friend.image} className="rounded-full h-full w-full" />
                </div>
                <div className="flex-1">
                    <p className="text-base">{friend.friend.name}</p>
                    <p className="text-xs">{friend.friend?.bio}</p>
                </div>
            </div>
            <div className="flex justify-center relative" ref={menuModal}>
                <button className="px-2" onClick={() => setShowMenuModal((prev) => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4" viewBox="0 0 128 512">
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                    </svg>
                </button>
                {showMenuModal && (
                    <div className="z-10 bg-white shadow-md rounded min-w-32 text-center absolute top-8 right-2">
                        <ul>
                            <li className="hover:bg-gray-300">
                                <button className="w-full p-2" onClick={handleClick}>
                                    Remove
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friend;
