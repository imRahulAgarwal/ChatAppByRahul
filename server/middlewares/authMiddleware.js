import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
const { JWT_SECRET } = process.env;

export const isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next(new ErrorHandler("Authentication header not provided", 400));

        const token = authHeader.split(" ")[1];
        if (!token) return next(new ErrorHandler("Authentication token not provided.", 400));

        const payload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: payload.userId }).lean();
        if (!user) return next(new ErrorHandler("User not found, register before login.", 404));

        req.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, error.statusCode));
    }
};
