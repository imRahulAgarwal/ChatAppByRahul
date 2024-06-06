import React, { useState } from "react";
import { userService } from "../api/user";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const Register = () => {
    const [loader, setLoader] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [preview, setPreview] = useState("");
    const [image, setImage] = useState();
    const [bio, setBio] = useState("");

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleBioChange = (e) => {
        setBio((prev) => {
            if (e.target.value.length <= 100) {
                return e.target.value;
            }
            return prev;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("bio", bio);
        if (image) {
            formData.append("image", image);
        }

        const result = await userService.register(formData);
        if (result) navigate("/login");
        else {
            setPassword("");
            setShowPassword(false);
        }
        setLoader(false);
    };

    return (
        <>
            <div className={`container mx-auto flex flex-col ${loader ? "h-screen overflow-hidden" : ""}`}>
                <div className="my-10 w-full max-w-lg mx-auto flex flex-col gap-y-4 p-4">
                    <form onSubmit={handleSubmit} className="bg-white rounded flex flex-col gap-y-4 shadow-md py-4 px-3">
                        <h1 className="text-xl md:text-2xl text-center">Register</h1>
                        <div className={`flex w-fit mx-auto image-div relative ${preview ? "" : "bg-blue-100"}`}>
                            <label className={`text-black image-label ${preview ? "absolute right-6 -bottom-2 p-2 border rounded-full bg-white" : "w-full h-full"}`} htmlFor="image">
                                {!preview ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 448 512">
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 512 512">
                                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                                    </svg>
                                )}
                            </label>
                            <input
                                className="border rounded focus:outline-none focus:ring-0 hidden"
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/png, image/gif, image/jpeg, image/heic, image/heif,"
                            />
                            {preview && <img src={preview} className="rounded-full" />}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="name">Name</label>
                            <input
                                className="border px-4 py-2 rounded focus:outline-none focus:ring-0"
                                value={name}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                title="Name"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                                    className="border w-1/4 text-blue-950 outline-none bg-blue-100 hover:bg-blue-200 duration-150 ease-in-out transition-all rounded-e"
                                    onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                className="border px-4 py-2 rounded focus:outline-none focus:ring-0"
                                value={bio}
                                type="text"
                                id="bio"
                                name="bio"
                                rows={4}
                                placeholder="Bio"
                                title="Bio"
                                onChange={handleBioChange}></textarea>
                            <span className="ml-auto text-sm md:text-xs mt-2">{bio.length}/100</span>
                        </div>

                        <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 duration-150 transition-all ease-in-out py-2 rounded">
                            Register
                        </button>
                    </form>
                    <div className="text-center">
                        <Link to="/login" className=" text-blue-600 text-lg hover:text-blue-800 font-semibold duration-150 transition-all ease-in-out">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
            {loader && <Loader />}
        </>
    );
};

export default Register;
