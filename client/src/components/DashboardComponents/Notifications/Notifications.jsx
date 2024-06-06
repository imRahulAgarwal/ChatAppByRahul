import React from "react";
import Notification from "../../Notification/Notification";

const Notifications = ({ notifications, acceptRequest, rejectRequest }) => {
    return (
        <>
            <div className="flex border-b justify-between px-2 py-4">
                <h1>Notifications</h1>
            </div>

            <div className={`h-full overflow-y-auto ${notifications.length ? "" : "flex"}`}>
                <div className="p-2 flex flex-col gap-y-2 m-auto w-full">
                    {notifications.length ? (
                        notifications.map((notification) => (
                            <Notification
                                key={notification.requestId}
                                notification={notification}
                                acceptRequest={() => acceptRequest(notification.requestId)}
                                rejectRequest={() => rejectRequest(notification.requestId)}
                            />
                        ))
                    ) : (
                        <p className="text-center rounded border bg-gray-200 p-2">No new friend requests.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
