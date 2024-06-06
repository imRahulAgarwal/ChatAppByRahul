import express from "express";
import messageController from "../controllers/messageController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.use(isLoggedIn);

// Get all messages of a chat
messageRouter.get("/:chatId", messageController.listMessages);

// Create a new message
messageRouter.post("/", messageController.addMessage);

export default messageRouter;
