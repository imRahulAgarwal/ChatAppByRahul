import { hash } from "bcrypt";
import { Schema, model } from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
const { APPWRITE_API_ENDPOINT, APPWRITE_PROFILE_BUCKET_ID, APPWRITE_PROJECT_ID } = process.env;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        imageId: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

userSchema.pre("save", async function (next) {
    try {
        this.password = await hash(this.password, 10);
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

userSchema.post("findOne", function (doc, next) {
    try {
        if (doc) {
            doc.image = `${APPWRITE_API_ENDPOINT}/storage/buckets/${APPWRITE_PROFILE_BUCKET_ID}/files/${doc.imageId}/view?project=${APPWRITE_PROJECT_ID}`;
        }
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

userSchema.post("find", function (docs, next) {
    try {
        if (docs.length) {
            for (const doc of docs) {
                doc.image = `${APPWRITE_API_ENDPOINT}/storage/buckets/${APPWRITE_PROFILE_BUCKET_ID}/files/${doc.imageId}/view?project=${APPWRITE_PROJECT_ID}`;
            }
        }
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

const User = model("users", userSchema);

export default User;
