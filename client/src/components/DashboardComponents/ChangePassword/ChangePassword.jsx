import React, { useState } from "react";
import Input from "../../Input/Input";
import { userService } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/auth/auth";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await userService.changePassword(currentPassword, newPassword, confirmPassword);
        if (result) {
            navigate("/");
            dispatch(logout());
        } else {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <>
            <div className="flex border-b justify-between px-2 py-4">
                <h1>Change Password</h1>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    <Input
                        autocomplete="current-password"
                        id="current-password"
                        value={currentPassword}
                        setChange={(e) => setCurrentPassword(e.target.value)}
                        label="Current Password"
                        title="Current Password"
                        type="password"
                        inputClass="bg-transparent border-b border-[#00000035]"
                    />
                    <Input
                        autocomplete="new-password"
                        id="new-password"
                        value={newPassword}
                        setChange={(e) => setNewPassword(e.target.value)}
                        label="New Password"
                        title="New Password"
                        type="password"
                        inputClass="bg-transparent border-b border-[#00000035]"
                    />
                    <Input
                        autocomplete="new-password"
                        id="confirm-password"
                        value={confirmPassword}
                        setChange={(e) => setConfirmPassword(e.target.value)}
                        label="Confirm Password"
                        title="Confirm Password"
                        type="password"
                        inputClass="bg-transparent border-b border-[#00000035]"
                    />
                    <button className="py-2 rounded bg-blue-400 hover:bg-blue-700 hover:text-white duration-200 ease-in-out transition-colors">Update Password</button>
                </form>
            </div>
        </>
    );
};

export default ChangePassword;
