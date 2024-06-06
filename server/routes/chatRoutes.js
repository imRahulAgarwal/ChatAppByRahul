import express from "express";
import chatController from "../controllers/chatController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.use(isLoggedIn);

// Get all chats
chatRouter.get("/", chatController.listChats);

// Access a chat
// If chat does not exist create a chat
chatRouter.post("/", chatController.accessChat);

export default chatRouter;
