import React, { useState } from "react";
import { userService } from "../api/user";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/auth/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await userService.login(email, password);
        if (result) {
            navigate("/");
            dispatch(login(result));
        } else {
            setPassword("");
            setShowPassword(false);
        }
    };

    return (
        <div className="container h-full w-full mx-auto flex flex-col gap-y-4 justify-center items-center px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded flex flex-col gap-y-4 shadow-md py-4 px-3 w-full max-w-lg">
                <h1 className="text-xl md:text-2xl text-center">Login</h1>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
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
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <div className="flex">
                        <input
                            className="border w-3/4 px-4 py-2 rounded-s focus:outline-none focus:ring-0"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            id="password"
                            placeholder="Password"
                            title="Password"
                            required
                        />
                        <button
                            type="button"
                            className="border w-1/4 text-blue-950 bg-blue-100 hover:bg-blue-200 duration-150 ease-in-out transition-all rounded-e"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <Link to="/forgot-password" className="text-blue-600 text-sm ml-auto hover:text-blue-800 font-semibold duration-150 transition-colors ease-in-out">
                    Forgot Password
                </Link>
                <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 duration-150 transition-all ease-in-out py-2 rounded">
                    Login
                </button>
            </form>
            <Link to="/register" className="text-blue-600 text-lg hover:text-blue-800 font-semibold duration-150 transition-all ease-in-out">
                Create an account
            </Link>
        </div>
    );
};

export default Login;
