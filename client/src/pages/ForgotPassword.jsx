import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../api/user";
import Loader from "../components/Loader/Loader";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const result = await userService.forgotPassword(email);
        if (result) navigate("/login");
        setLoader(false);
    };

    return (
        <>
            <div className="container h-full w-full mx-auto flex flex-col gap-y-4 justify-center items-center px-4">
                <form onSubmit={handleSubmit} className="bg-white rounded flex flex-col gap-y-4 shadow-md py-4 px-3 w-full max-w-lg">
                    <div className="flex flex-col gap-y-1">
                        <h1 className="text-xl md:text-2xl text-center">Forgot Password</h1>
                        <p className="text-sm text-center">A mail will be sent to the email address, with link to reset password</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="hidden">
                            Email
                        </label>
                        <input
                            className="border px-4 py-2 rounded focus:outline-none focus:ring-0"
                            value={email}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            title="Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 duration-150 transition-all ease-in-out py-2 rounded">
                        Send Mail
                    </button>
                </form>
                <Link to="/login" className="text-blue-600 text-lg hover:text-blue-800 font-semibold duration-150 transition-all ease-in-out">
                    Back to Login
                </Link>
            </div>
            {loader && <Loader />}
        </>
    );
};

export default ForgotPassword;
