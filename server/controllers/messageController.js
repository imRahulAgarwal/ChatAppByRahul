import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import upload from "../utils/upload.js";
import { validateObjectId } from "../utils/validations.js";

const listMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const validationResult = await validateObjectId(chatId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const messages = await Message.find({ chatId }).populate("senderId", "_id name imageId image").lean();

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const addMessage = async (req, res, next) => {
    upload.single("attatchment")(req, res, async (error) => {
        try {
            const loggedInUser = req.user;

            const { content, chatId } = req.body;
            const validationResult = await validateObjectId(chatId);
            if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

            const newMessage = new Message({ senderId: loggedInUser._id, content, chatId });

            if (req.file) {
            }

            const result = await newMessage.save();
            if (!result) return next(new ErrorHandler("Message not sent"));

            const message = await Message.findOne({ _id: result._id }).populate("senderId", "_id name imageId image").populate("chatId").lean();
            const chat = await Chat.findOneAndUpdate({ _id: chatId }, { $set: { latestMessage: result._id } }, { returnDocument: "after" })
                .populate("users", "_id name imageId image")
                .populate("latestMessage", "senderId content createdAt")
                .lean();

            return res.status(200).json({ success: true, message, chat });
        } catch (error) {
            return next(new ErrorHandler(error.message));
        }
    });
};

export default { listMessages, addMessage };
