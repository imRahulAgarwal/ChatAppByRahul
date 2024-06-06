import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        chatId: {
            type: Types.ObjectId,
            ref: "chats",
            required: true,
        },
        attachments: [
            {
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

const Message = model("messages", messageSchema);

export default Message;
