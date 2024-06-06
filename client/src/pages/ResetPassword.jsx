import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../api/user";

const ResetPassword = () => {
    const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await userService.resetPassword(token, newPassword, confirmPassword);
        if (result) navigate("/login");
    };

    return (
        <div className="container h-full w-full mx-auto flex flex-col gap-y-4 justify-center items-center px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded flex flex-col gap-y-4 shadow-md py-4 px-3 w-full max-w-lg">
                <h1 className="text-xl md:text-2xl text-center">Reset Password</h1>
                <div className="flex flex-col">
                    <label htmlFor="new-password" className="text-sm">
                        New Password
                    </label>
                    <input
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-0"
                        value={newPassword}
                        type={showPassword ? "text" : "password"}
                        id="new-password"
                        name="new-password"
                        placeholder="New Password"
                        title="New Password"
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="confirm-password" className="text-sm">
                        Confirm Password
                    </label>
                    <input
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-0"
                        value={confirmPassword}
                        type={showPassword ? "text" : "password"}
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm Password"
                        title="Confirm Password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="button" className="px-4 py-2 bg-gray-200 mx-auto text-sm rounded" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? "Hide" : "Show"} Password
                </button>
                <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 duration-150 transition-all ease-in-out py-2 rounded">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
