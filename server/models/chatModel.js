import { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
    {
        isGroup: {
            type: Boolean,
            required: true,
            default: false,
        },
        chatName: {
            type: String,
        },
        groupAdmin: {
            type: Types.ObjectId,
        },
        users: [
            {
                type: Types.ObjectId,
                required: true,
                ref: "users",
            },
        ],
        latestMessage: {
            type: Types.ObjectId,
            ref: "messages",
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

const Chat = model("chats", chatSchema);

export default Chat;
