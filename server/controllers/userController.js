import { compare, hash } from "bcrypt";
import User from "../models/userModel.js";
import upload from "../utils/upload.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Client, ID, Storage, InputFile } from "node-appwrite";
import validateRegisterObject from "../utils/validateUserObject.js";
import { validateObjectId } from "../utils/validations.js";
import Request from "../models/requestModel.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import sendForgotPasswordMail from "../utils/sendMail.js";

const { JWT_SECRET, APPWRITE_PROJECT_ID, APPWRITE_API_ENDPOINT, APPWRITE_PROFILE_BUCKET_ID, APPWRITE_API_KEY, DEFAULT_IMAGE_ID } = process.env;

const client = new Client().setEndpoint(APPWRITE_API_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY);
const storage = new Storage(client);
// storage.getFile() returns file data information
// storage.getFileView() returns buffer of the data

// Done
const register = async (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        try {
            if (error) return next(new ErrorHandler(error.message, error.code));
            const { name, email, password, bio } = req.body;

            const findUserExists = await User.findOne({ email });
            if (findUserExists) return next(new ErrorHandler("User already exists, try login.", 400));

            const validationResult = await validateRegisterObject({ name, bio, email, password }, "CREATE");
            if (validationResult.error) return next(new ErrorHandler(validationResult.error.message));

            const newUser = new User(validationResult.value);
            const image = req.file;

            if (image) {
                const result = await storage.createFile(APPWRITE_PROFILE_BUCKET_ID, ID.unique(), InputFile.fromBuffer(image.buffer, image.originalname));
                newUser.set("imageId", result.$id);
            } else {
                newUser.set("imageId", DEFAULT_IMAGE_ID);
            }

            const result = await newUser.save();
            if (!result) return next(new ErrorHandler("Unable to register user at the moment."));

            return res.status(201).json({ success: true, message: "User registered successfully." });
        } catch (error) {
            return next(new ErrorHandler(error.message));
        }
    });
};

// Done
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // I have used the lean() so that the document returned changes into a JS Object
        // And then it can be modified
        const user = await User.findOne({ email }).lean();

        if (!user) return next(new ErrorHandler("Invalid login credentials, please check the credentials.", 404));

        const isPasswordSame = await compare(password, user.password);
        if (!isPasswordSame) return next(new ErrorHandler("Invalid login credentials, please check the credentials.", 404));

        const token = await jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

        const { password: p, resetPasswordToken, createdAt, imageId, ...info } = user;
        return res.status(200).json({ success: true, message: "User logged in.", token, user: info });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Done
const profile = async (req, res, next) => {
    try {
        const { password, createdAt, resetPasswordToken, imageId, ...user } = req.user;
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateProfile = async (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        try {
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));
            const user = req.user;

            const { name, bio, removeImage } = req.body;
            const updateQuery = {};

            let imageId = user.imageId;

            if (req.file) {
                const image = req.file;
                const result = await storage.createFile(APPWRITE_PROFILE_BUCKET_ID, ID.unique(), InputFile.fromBuffer(image.buffer, image.originalname));

                if (imageId !== DEFAULT_IMAGE_ID) {
                    await storage.deleteFile(APPWRITE_PROFILE_BUCKET_ID, imageId);
                }
                imageId = result.$id;
            }

            if (removeImage === "true") {
                if (imageId !== DEFAULT_IMAGE_ID) {
                    await storage.deleteFile(APPWRITE_PROFILE_BUCKET_ID, imageId);
                }
                imageId = DEFAULT_IMAGE_ID;
            }

            updateQuery.name = name ? name : user.name;
            updateQuery.bio = bio;
            updateQuery.imageId = imageId;

            const updatedProfile = await User.findOneAndUpdate({ _id: user._id }, { $set: updateQuery }, { returnDocument: "after" });
            if (!updatedProfile) return next(new ErrorHandler("Unable to update the profile at the moment."));

            const profile = await User.findOne({ _id: user._id }, { name: 1, email: 1, bio: 1, imageId: 1 }).lean();
            return res.status(200).json({ success: true, message: "Profile updated successfully", updatedProfile: profile });
        } catch (error) {
            return next(new ErrorHandler(error.message));
        }
    });
};

// Done
const changePassword = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) return next(new ErrorHandler("Passwords do not match.", 400));

        const isPasswordSame = await compare(oldPassword, loggedInUser.password);
        if (!isPasswordSame) return next(new ErrorHandler("Invalid password", 400));

        const hashedPassword = await hash(newPassword, 10);
        const updateResult = await User.updateOne({ _id: loggedInUser._id }, { $set: { password: hashedPassword } });

        if (!updateResult.modifiedCount) return next(new ErrorHandler("Unable to change the password at the moment."));

        return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Done
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new ErrorHandler("User not found for the provided email.", 404));

        const token = await jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "5m" });

        await User.updateOne({ email }, { $set: { resetPasswordToken: token } });

        const result = await sendForgotPasswordMail({
            name: user.name,
            email: user.email,
            token,
        });

        if (result) return next(new ErrorHandler(result.message, result.statusCode));

        return res.status(200).json({ success: true, message: "Mail has been sent to your provided e-mail id." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token) return next(new ErrorHandler("Token not provided", 400));

        if (newPassword !== confirmPassword) return next(new ErrorHandler("Passwords do not match.", 400));

        const tokenPayload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: tokenPayload.userId, resetPasswordToken: token });
        if (!user) return next(new ErrorHandler("User not registered.", 404));

        user.set("password", newPassword);
        const result = await user.save();
        if (!result) return next(new ErrorHandler("Unable to register user at the moment."));

        return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Done
const searchUsers = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { search } = req.query;

        const searchQuery = { _id: { $ne: loggedInUser._id } };
        if (search) searchQuery.name = { $regex: search, $options: "i" };

        const users = await User.find(searchQuery, { name: 1, imageId: 1, bio: 1 }).lean();
        if (!users.length) return next(new ErrorHandler("Users not found", 404));

        const userList = [];

        for (const { imageId, ...user } of users) {
            const requestExists = await Request.findOne({
                $and: [{ $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }] }, { $or: [{ sender: user._id }, { receiver: user._id }] }],
            });

            let requestId = "";
            let isFriend = "Follow";
            let isSender = null;

            if (requestExists) {
                requestId = requestExists._id;
                isSender = String(requestExists.sender) === String(loggedInUser._id) ? true : false;
                isFriend = requestExists ? (requestExists.isAccepted ? "Unfollow" : "Pending") : "Follow";
            }

            userList.push({ user, requestId, isSender, isFriend });
        }

        return res.status(200).json({ success: true, users: userList });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// List all requests received by an authenticated user
// get route /api/user/friend-requests
const listRequests = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const requests = await Request.find({ receiver: loggedInUser._id, isAccepted: false }).populate("sender", "_id name bio imageId").lean();

        const requestList = [];
        for (const request of requests) {
            const { imageId, ...sender } = request.sender;

            requestList.push({
                sender,
                requestId: request._id,
                isAccepted: false,
            });
        }

        return res.status(200).json({ success: true, requests: requestList });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Authenticated user sends a friend request to another user
// post route /api/user/friend-requests
const sendRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { receiverId } = req.body;
        const validationResult = await validateObjectId(receiverId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const requestExist = await Request.findOne({
            $and: [{ $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }] }, { $or: [{ sender: receiverId }, { receiver: receiverId }] }],
        });
        if (requestExist) return next(new ErrorHandler("Request already sent.", 400));

        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) return next(new ErrorHandler("User not found", 404));

        let newRequest = await Request.create({ sender: loggedInUser._id, receiver: receiverId });
        if (!newRequest) return next(new ErrorHandler("Unable to send friend request at the moment"));

        newRequest = await Request.populate(newRequest, { path: "sender", select: "name imageId bio", options: { lean: true } });
        const { imageId, ...sender } = newRequest.sender;

        return res.status(200).json({
            success: true,
            message: "Friend request send",
            newRequest: {
                sender,
                receiver: newRequest.receiver,
                requestId: newRequest._id,
                isAccepted: false,
            },
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// The user who had sent the friend request can remove the friend request
// delete route /api/user/friend-requests/remove
const removeRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { requestId } = req.body;
        const validationResult = await validateObjectId(requestId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const searchQuery = { _id: requestId, sender: loggedInUser._id, isAccepted: false };
        const request = await Request.findOne(searchQuery).populate("sender", "name bio imageId").lean();
        if (!request) return next(new ErrorHandler("Friend request not found"));

        const deleteResult = await Request.deleteOne(searchQuery);
        if (!deleteResult.deletedCount) return next(new ErrorHandler("Unable to remove friend request at the moment"));

        return res.status(200).json({ success: true, message: "Friend request removed", request });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// The user who have received the friend reques can accept the friend request
// patch route /api/user/friend-requests/accept
const acceptRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { requestId } = req.body;
        const validationResult = await validateObjectId(requestId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const searchQuery = { _id: requestId, receiver: loggedInUser._id, isAccepted: false };
        const request = await Request.findOne(searchQuery);
        if (!request) return next(new ErrorHandler("Friend request not found"));

        const updateResult = await Request.updateOne(searchQuery, { $set: { isAccepted: true } });

        if (!updateResult.modifiedCount) return next(new ErrorHandler("Unable to accept friend request at the moment"));

        return res.status(200).json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// The user who have received the friend reques can reject the friend request
// delete route /api/user/friend-requests/reject
const rejectRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { requestId } = req.body;
        const validationResult = await validateObjectId(requestId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const searchQuery = { _id: requestId, receiver: loggedInUser._id, isAccepted: false };
        const request = await Request.findOne(searchQuery);
        if (!request) return next(new ErrorHandler("Friend request not found"));

        const deleteResult = await Request.deleteOne(searchQuery);
        if (!deleteResult.deletedCount) return next(new ErrorHandler("Unable to reject friend request at the moment"));

        return res.status(200).json({ success: true, message: "Friend request rejected" });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Sender user will see receiver user information
// Receiver user will see sender user information
// get route /api/user/friends
const listFriends = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const requests = await Request.find({ $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }], isAccepted: true }, { createdAt: 0 })
            .populate("sender receiver", "_id name image imageId bio")
            .lean();

        const friendsList = [];

        for (const request of requests) {
            const data = { isFriend: "Unfollow", requestId: request._id, friend: {} };

            if (String(request.sender._id) === String(loggedInUser._id)) {
                const { imageId, ...receiver } = request.receiver;
                data.friend = receiver;
            } else {
                const { imageId, ...sender } = request.sender;
                data.friend = sender;
            }
            friendsList.push(data);
        }

        return res.status(200).json({ success: true, friends: friendsList });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Done
const removeFriend = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const { requestId } = req.body;
        const validationResult = await validateObjectId(requestId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const searchQuery = { _id: requestId, $or: [{ sender: loggedInUser._id }, { receiver: loggedInUser._id }] };

        const request = await Request.findOne(searchQuery);
        if (!request) return next(new ErrorHandler("Friend not found.", 404));

        const deleteResult = await Request.deleteOne(searchQuery);
        if (!deleteResult.deletedCount) return next(new ErrorHandler("Friend not removed"));

        const deletedChat = await Chat.findOneAndDelete({ $and: [{ users: { $elemMatch: { $eq: request.receiver } } }, { users: { $elemMatch: { $eq: request.sender } } }] });
        await Message.deleteMany({ chatId: deletedChat._id });

        const data = { requestId: request._id, friend: "", chatId: deletedChat._id };

        if (String(request.sender._id) === String(loggedInUser._id)) {
            data.friend = request.receiver._id;
        } else {
            data.friend = request.sender._id;
        }

        return res.status(200).json({ success: true, message: "Friend removed.", friend: data });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export default {
    login,
    register,
    profile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    searchUsers,
    listRequests,
    sendRequest,
    removeRequest,
    acceptRequest,
    rejectRequest,
    listFriends,
    removeFriend,
};
