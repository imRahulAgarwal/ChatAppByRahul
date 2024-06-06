import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../../../api/user";
import { login } from "../../../store/auth/auth";
import Loader from "../../Loader/Loader";

const ProfileSection = ({ setTab }) => {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState();
    const [preview, setPreview] = useState("");
    const [removeImage, setRemoveImage] = useState(false);

    const [editProfile, setEditProfile] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleTrashClick = () => {
        setRemoveImage(true);
        setPreview("");
        setImage();
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
            setRemoveImage(false);
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

    const handleSubmitButtonClick = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        formData.append("removeImage", removeImage);
        if (image) {
            formData.append("image", image);
        }

        setLoading(true);
        const result = await userService.updateProfile(formData);
        if (result) dispatch(login(result));

        setEditProfile(false);
        setLoading(false);
    };

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
            setBio(user.bio);
            setPreview(user.image);
        }
    }, [editProfile]);

    return (
        <>
            <div className="flex border-b justify-between px-2 py-4">
                <h1>Profile</h1>
            </div>
            <div className="h-full overflow-y-auto flex flex-col sm:py-8 py-4 px-6 gap-y-6">
                <div className={`flex w-full justify-center`}>
                    {editProfile ? (
                        <div className="relative w-32">
                            <input
                                className="border rounded focus:outline-none focus:ring-0 hidden"
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/png, image/gif, image/jpeg, image/heic, image/heif"
                            />
                            {preview && <img src={preview} className="w-32 h-32 rounded-full border border-[#00000035]" />}
                            <div className={`flex justify-between gap-x-4 ${preview ? "mt-2" : ""}`}>
                                <label className="rounded-sm py-1 bg-gray-500 text-white cursor-pointer w-full flex justify-center" htmlFor="image">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 512 512">
                                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                                    </svg>
                                </label>
                                <button className="w-full py-1 rounded-sm bg-yellow-400 flex justify-center" onClick={handleTrashClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 448 512">
                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full relative">
                            <img src={preview} className="w-full bg-gray-200 h-full rounded-full border border-[#00000035]" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-y-1">
                    {editProfile ? (
                        <>
                            <label htmlFor="name" className="text-xs">
                                Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                type="text"
                                name="name"
                                title="Name"
                                placeholder="Your name"
                                className="w-full outline-none bg-transparent border-b focus:border-b-2 focus:border-b-[#00000035]"
                            />
                        </>
                    ) : (
                        <>
                            <span className="text-xs">Name</span>
                            <span className="text-lg cursor-default border-b-2">{name}</span>
                        </>
                    )}
                </div>
                <div className={`flex flex-col gap-y-1 ${editProfile ? "opacity-50" : ""}`}>
                    <span className="text-xs">Email</span>
                    <span className="text-lg cursor-default border-b-2">{user.email}</span>
                </div>
                <div className="flex flex-col gap-y-1">
                    {editProfile ? (
                        <>
                            <label htmlFor="bio" className="text-xs">
                                Bio
                            </label>
                            <textarea
                                className="resize-none overflow-y-auto bg-transparent border-b focus:border-b-2 focus:border-b-[#00000035] outline-none"
                                value={bio}
                                onChange={handleBioChange}
                                id="bio"
                                name="bio"
                                rows={5}
                            />
                            <span className="text-xs ml-auto">{bio.length}/100</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xs">Bio</span>
                            <span className="min-h-28 text-lg border-b-2 cursor-default">{bio}</span>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-y-2">
                    {editProfile ? (
                        <>
                            <button className="rounded px-4 py-2 w-full bg-green-500 hover:bg-green-600 hover:text-white duration-200 ease-in-out transition-colors" onClick={handleSubmitButtonClick}>
                                Update
                            </button>
                            <button className="rounded px-4 py-2 w-full bg-gray-300 hover:bg-gray-400 duration-200 ease-in-out transition-colors" onClick={() => setEditProfile(false)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="">
                                <button className="rounded px-4 py-2 w-full bg-gray-300 hover:bg-gray-400 duration-200 ease-in-out transition-colors" onClick={() => setEditProfile(true)}>
                                    Edit
                                </button>
                            </div>
                            <div className="rounded">
                                <button
                                    onClick={() => setTab("change-password")}
                                    className="w-full p-2 rounded bg-blue-400 hover:bg-blue-700 duration-200 ease-in-out transition-colors hover:text-white">
                                    Change Password
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {loading && <Loader />}
        </>
    );
};

export default ProfileSection;
