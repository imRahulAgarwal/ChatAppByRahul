import React, { useRef, useState } from "react";

const Notification = ({ notification, acceptRequest, rejectRequest }) => {
    const [showMenuModal, setShowMenuModal] = useState(false);
    const menuModal = useRef(null);

    const closeMenu = (e) => {
        if (showMenuModal && !menuModal.current?.contains(e.target)) {
            setShowMenuModal(false);
        }
    };
    document.addEventListener("mousedown", closeMenu);

    return (
        <div className={`p-2 flex justify-between border-b`}>
            <div className="flex items-center cursor-pointer flex-1">
                <div className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mr-3">
                    <img src={notification.sender.image} className="rounded-full h-full w-full" />
                </div>
                <div className="flex-1">
                    <p className="text-base">{notification.sender.name}</p>
                    <p className="text-xs">{notification.sender.bio}</p>
                </div>
            </div>
            <div className="flex justify-center relative" ref={menuModal}>
                <button className="px-2" onClick={() => setShowMenuModal((prev) => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4" viewBox="0 0 128 512">
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                    </svg>
                </button>
                {showMenuModal && (
                    <div className="z-10 bg-white shadow-md rounded min-w-32 absolute top-8 right-2">
                        <ul className="rounded">
                            <li className="w-full">
                                <button className="w-full text-start rounded-t bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 ease-in-out p-2" onClick={acceptRequest}>
                                    Accept
                                </button>
                            </li>
                            <li className="w-full">
                                <button className="w-full text-start rounded-b bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 ease-in-out p-2" onClick={rejectRequest}>
                                    Reject
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
