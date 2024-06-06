import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/auth/auth";

const Tabs = ({ tab, onTabClick, isChatOpen, notificationCount }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        if (token) {
            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/");
        }
    };

    return (
        <div className={`flex sm:flex-col items-center w-full sm:max-w-24 py-4 sm:py-6 sm:gap-y-4 sm:border-r max-sm:border-t ${isChatOpen ? "max-sm:hidden" : ""}`}>
            <div className="w-full flex justify-center" onClick={() => onTabClick("messages")}>
                <button className={`flex flex-col items-center ${tab === "messages" ? "text-blue-400" : "text-black hover:text-[#000000b4] duration-150 ease-in-out transition-colors"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 512 512">
                        <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
                    </svg>
                    <p className="text-xs sm:text-sm">Messages</p>
                </button>
            </div>
            <div className="w-full flex justify-center">
                <button
                    className={`flex flex-col items-center ${tab === "friends" ? "text-blue-400" : "text-black hover:text-[#000000b4] duration-150 ease-in-out transition-colors"}`}
                    onClick={() => onTabClick("friends")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-6 h-6">
                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                    </svg>
                    <p className="text-xs sm:text-sm">Friends</p>
                </button>
            </div>
            <div className="w-full flex justify-center">
                <button
                    className={`flex flex-col items-center ${tab === "profile" ? "text-blue-400" : "text-black hover:text-[#000000b4] duration-150 ease-in-out transition-colors"}`}
                    onClick={() => onTabClick("profile")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                    <p className="text-xs sm:text-sm">Profile</p>
                </button>
            </div>
            <div className="w-full flex justify-center">
                <button
                    className={`flex flex-col items-center relative ${tab === "notifications" ? "text-blue-400" : "text-black hover:text-[#000000b4] duration-150 ease-in-out transition-colors"}`}
                    onClick={() => onTabClick("notifications")}>
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                        </svg>
                        <p className="absolute rounded-full -top-2.5 -right-2.5 h-4 w-4 flex justify-center items-center bg-blue-800 text-white">
                            <span className="text-xs">{notificationCount}</span>
                        </p>
                    </div>
                    <p className="text-xs sm:text-sm">Notifications</p>
                </button>
            </div>
            <div className="sm:mt-auto w-full flex justify-center">
                <button className="flex flex-col items-center hover:text-[#000000b4] duration-150 ease-in-out transition-colors" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 512 512">
                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                    <p className="text-xs sm:text-sm">Logout</p>
                </button>
            </div>
        </div>
    );
};

export default Tabs;
