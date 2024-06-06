import { Schema, model, Types } from "mongoose";

const requestSchema = new Schema(
    {
        isAccepted: {
            type: Boolean,
            default: false,
            required: true,
        },
        sender: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        receiver: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
        versionKey: false,
    }
);

const Request = model("requests", requestSchema);
export default Request;
