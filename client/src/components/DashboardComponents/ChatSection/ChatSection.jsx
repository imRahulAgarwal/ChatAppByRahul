import React from "react";
import Chat from "../../Chat/Chat";
import { useSelector } from "react-redux";

const ChatSection = ({ setTab }) => {
    const { chats } = useSelector((state) => state.chat);
    return (
        <>
            <div className="flex border-b justify-between px-2 py-4">
                <h1>Chats</h1>
                <button onClick={() => setTab("friends")} title="Start a new chat">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                </button>
            </div>
            <div className={`h-full overflow-y-auto ${chats.length ? "" : "flex"}`}>
                <div className="p-2 flex flex-col gap-y-2 m-auto w-full">
                    {chats.length ? (
                        chats.map((chat) => <Chat chat={chat} key={chat._id} />)
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-y-2 text-lg rounded border bg-gray-200 w-full p-2">
                            <p className="">Start a new chat</p>
                            <button onClick={() => setTab("friends")} className="rounded-full bg-white p-2" title="Start a new chat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(ChatSection);
