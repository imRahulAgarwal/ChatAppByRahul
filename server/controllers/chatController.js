import Chat from "../models/chatModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { validateObjectId } from "../utils/validations.js";

// Access user's all chats
const listChats = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const chats = await Chat.find({ users: { $elemMatch: { $eq: loggedInUser._id } } })
            .populate("users", "_id name imageId image")
            .populate("latestMessage", "senderId content createdAt")
            .lean();

        return res.status(200).json({ success: true, chats });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const accessChat = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const { userId } = req.body;

        const validationResult = await validateObjectId(userId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        let chat = undefined;
        chat = await Chat.findOne({
            $and: [{ users: { $elemMatch: { $eq: loggedInUser._id } } }, { users: { $elemMatch: { $eq: userId } } }],
        })
            .populate("users", "name _id imageId image")
            .lean();

        if (!chat) {
            const createdChat = await Chat.create({ chatName: "sender", users: [loggedInUser._id, userId] });
            chat = await Chat.findOne({ _id: createdChat._id }).populate("users", "name _id imageId image").lean();
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export default { listChats, accessChat };
